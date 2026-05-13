package pl.presence.tracker.telemetry.messaging;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import pl.presence.tracker.telemetry.repository.TelemetryRepository;

@Service
public class KafkaTelemetryConsumer {

    private final TelemetryRepository telemetryRepository;

    public KafkaTelemetryConsumer(TelemetryRepository telemetryRepository) {
        this.telemetryRepository = telemetryRepository;
    }

    @KafkaListener(topics = "${kafka.telemetry-topic}")
    public void onMessage(String payload) {
        telemetryRepository.savePayload(payload);
    }
}
