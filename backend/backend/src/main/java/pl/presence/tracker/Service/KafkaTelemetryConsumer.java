package pl.presence.tracker.Service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaTelemetryConsumer {

    private final TelemetryStorageService telemetryStorageService;

    public KafkaTelemetryConsumer(TelemetryStorageService telemetryStorageService) {
        this.telemetryStorageService = telemetryStorageService;
    }

    @KafkaListener(topics = "${kafka.telemetry-topic}")
    public void onMessage(String payload) {
        telemetryStorageService.handlePayload(payload);
    }
}
