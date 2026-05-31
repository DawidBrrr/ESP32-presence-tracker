package pl.presence.tracker.telemetry.repository;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApi;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import pl.presence.tracker.telemetry.model.TelemetryPoint;

@Repository
public class TelemetryRepository {

    private static final Logger log = LoggerFactory.getLogger(TelemetryRepository.class);
    private static final String MEASUREMENT_NAME = "telemetry";

    private final InfluxDBClient influxDBClient;
    private final WriteApi writeApi;
    private final ObjectMapper objectMapper;
    private final Clock clock;
    private final String influxBucket;
    private final String influxOrg;

    public TelemetryRepository(
            InfluxDBClient influxDBClient,
            WriteApi writeApi,
            ObjectMapper objectMapper,
            @Value("${influx.bucket}") String influxBucket,
            @Value("${influx.org}") String influxOrg) {
        this.influxDBClient = influxDBClient;
        this.writeApi = writeApi;
        this.objectMapper = objectMapper;
        this.influxBucket = influxBucket;
        this.influxOrg = influxOrg;
        this.clock = Clock.systemUTC();
    }

    public Optional<TelemetryPoint> savePayload(String payload) {
        if (payload == null || payload.isBlank()) {
            return Optional.empty();
        }

        TelemetryPoint telemetry = parsePayload(payload);
        if (telemetry == null) {
            return Optional.empty();
        }

        Point point = Point.measurement(MEASUREMENT_NAME)
                .addTag("device_id", telemetry.deviceId())
                .addField("count", telemetry.count())
                .time(telemetry.timestamp(), WritePrecision.MS);

        try {
            writeApi.writePoint(point);
            log.info("Queued telemetry write: deviceId={}, count={}", telemetry.deviceId(), telemetry.count());
        } catch (Exception ex) {
            log.warn("Failed to write telemetry to InfluxDB", ex);
        }

        return Optional.of(telemetry);
    }

    public Optional<TelemetryPoint> findLatest(String deviceId) {
        if (deviceId == null || deviceId.isBlank()) {
            return Optional.empty();
        }

        String sanitizedDeviceId = deviceId.replace("\"", "\\\"");
        String flux = String.format(
                "from(bucket: \"%s\") |> range(start: -30d) "
                        + "|> filter(fn: (r) => r._measurement == \"%s\" "
                        + "and r.device_id == \"%s\" and r._field == \"count\") "
                        + "|> last()",
                influxBucket, MEASUREMENT_NAME, sanitizedDeviceId);

        try {
            List<FluxTable> tables = influxDBClient.getQueryApi().query(flux, influxOrg);
            for (FluxTable table : tables) {
                for (FluxRecord record : table.getRecords()) {
                    Instant timestamp = record.getTime();
                    Integer count = intValueOrNull(record.getValue());
                    if (timestamp != null && count != null) {
                        return Optional.of(new TelemetryPoint(deviceId, count, timestamp));
                    }
                }
            }
        } catch (Exception ex) {
            log.warn("Failed to query latest telemetry for deviceId={}", deviceId, ex);
        }

        return Optional.empty();
    }

    private TelemetryPoint parsePayload(String payload) {
        try {
            String jsonPayload = extractJson(payload);
            JsonNode root = objectMapper.readTree(jsonPayload);
            if (root.isTextual()) {
                root = objectMapper.readTree(root.asText());
            }
            String deviceId = textOrNull(root.get("device_id"));
            Integer count = intOrNull(root.get("count"));
            if (deviceId == null || deviceId.isBlank() || count == null) {
                return null;
            }
            return new TelemetryPoint(deviceId, count, Instant.now(clock));
        } catch (Exception ex) {
            log.warn("Invalid telemetry payload: {}", payload);
            return null;
        }
    }

    private String extractJson(String payload) {
        int start = payload.indexOf('{');
        int end = payload.lastIndexOf('}');
        if (start == -1 || end == -1 || end <= start) {
            return payload;
        }
        return payload.substring(start, end + 1);
    }

    private String textOrNull(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        String value = node.asText();
        return value == null || value.isBlank() ? null : value;
    }

    private Integer intOrNull(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        if (node.isInt() || node.isLong()) {
            return node.intValue();
        }
        if (node.isTextual()) {
            try {
                return Integer.parseInt(node.asText().trim());
            } catch (NumberFormatException ex) {
                return null;
            }
        }
        return null;
    }

    private Integer intValueOrNull(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value instanceof String text) {
            try {
                return Integer.parseInt(text.trim());
            } catch (NumberFormatException ex) {
                return null;
            }
        }
        return null;
    }
}
