package pl.presence.tracker.Service;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

@Service
public class TelemetryStorageService {

    private static final Logger log = LoggerFactory.getLogger(TelemetryStorageService.class);

    private final InfluxDBClient influxDBClient;
    private final ObjectMapper objectMapper;
    private final Clock clock;
    private final String influxBucket;
    private final String influxOrg;

    public TelemetryStorageService(
            InfluxDBClient influxDBClient,
            ObjectMapper objectMapper,
            @Value("${influx.bucket}") String influxBucket,
            @Value("${influx.org}") String influxOrg) {
        this.influxDBClient = influxDBClient;
        this.objectMapper = objectMapper;
        this.influxBucket = influxBucket;
        this.influxOrg = influxOrg;
        this.clock = Clock.systemUTC();
    }

    public void handleMqttMessage(Message<?> message) {
        String payload = readPayload(message.getPayload());
        if (payload == null || payload.isBlank()) {
            return;
        }

        TelemetryPayload telemetry = parsePayload(payload);
        if (telemetry == null) {
            return;
        }

        Point point = Point.measurement("telemetry")
                .addTag("device_id", telemetry.deviceId())
                .addField("people_count", telemetry.count())
                .time(Instant.now(clock), WritePrecision.MS);

        influxDBClient.getWriteApiBlocking().writePoint(influxBucket, influxOrg, point);
        log.info("Saved telemetry: deviceId={}, count={}", telemetry.deviceId(), telemetry.count());
    }

    private TelemetryPayload parsePayload(String payload) {
        try {
            JsonNode root = objectMapper.readTree(payload);
            String deviceId = textOrNull(root.get("device_id"));
            Integer count = intOrNull(root.get("count"));
            if (deviceId == null || deviceId.isBlank() || count == null) {
                return null;
            }
            return new TelemetryPayload(deviceId, count);
        } catch (Exception ex) {
            log.warn("Invalid telemetry payload: {}", payload);
            return null;
        }
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

    private String readPayload(Object payload) {
        if (payload == null) {
            return null;
        }
        if (payload instanceof byte[] bytes) {
            return new String(bytes, StandardCharsets.UTF_8);
        }
        return payload.toString();
    }

    private record TelemetryPayload(String deviceId, int count) {
    }
}
