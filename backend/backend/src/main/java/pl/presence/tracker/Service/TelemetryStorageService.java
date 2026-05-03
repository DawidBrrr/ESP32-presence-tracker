package pl.presence.tracker.Service;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.OffsetDateTime;

import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

import pl.presence.tracker.model.DeviceTelemetry;
import pl.presence.tracker.repository.DeviceTelemetryRepository;

@Service
public class TelemetryStorageService {

    private final DeviceTelemetryRepository repository;
    private final Clock clock;

    public TelemetryStorageService(DeviceTelemetryRepository repository) {
        this.repository = repository;
        this.clock = Clock.systemUTC();
    }

    public void handleMqttMessage(Message<?> message) {
        String topic = (String) message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC);
        if (topic == null || topic.isBlank()) {
            return;
        }

        TelemetryPayload payload = parseTelemetry(topic, message.getPayload());
        if (payload == null) {
            return;
        }

        DeviceTelemetry telemetry = repository.findById(payload.deviceId())
                .orElseGet(() -> new DeviceTelemetry(payload.deviceId()));
        telemetry.setPeopleCount(payload.peopleCount());
        telemetry.setUpdatedAt(OffsetDateTime.now(clock));
        repository.save(telemetry);

        System.out.printf("Updated telemetry for device %s: %d people%n",
                payload.deviceId(), payload.peopleCount());
    }

    private TelemetryPayload parseTelemetry(String topic, Object payload) {
        String[] parts = topic.split("/");
        if (parts.length >= 3 && "telemetry".equals(parts[0])) {
            Integer peopleCount = parseCount(parts[2]);
            if (peopleCount == null) {
                return null;
            }
            return new TelemetryPayload(parts[1], peopleCount);
        }

        if (parts.length == 2 && "telemetry".equals(parts[0])) {
            Integer peopleCount = parseCount(readPayload(payload));
            if (peopleCount == null) {
                return null;
            }
            return new TelemetryPayload(parts[1], peopleCount);
        }

        return null;
    }

    private Integer parseCount(String value) {
        if (value == null) {
            return null;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException ex) {
            return null;
        }
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

    private record TelemetryPayload(String deviceId, int peopleCount) {
    }
}
