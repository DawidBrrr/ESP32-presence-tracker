package pl.presence.tracker.telemetry.messaging;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import pl.presence.tracker.telemetry.repository.TelemetryRepository;
import pl.presence.tracker.websocket.TelemetryBroadcastService;

@Service
public class KafkaTelemetryConsumer {

    private final TelemetryRepository telemetryRepository;
    private final TelemetryBroadcastService telemetryBroadcastService;

    public KafkaTelemetryConsumer(TelemetryRepository telemetryRepository,
            TelemetryBroadcastService telemetryBroadcastService) {
        this.telemetryRepository = telemetryRepository;
        this.telemetryBroadcastService = telemetryBroadcastService;
    }

    @KafkaListener(topics = "${kafka.telemetry-topic}", concurrency = "10")
    public void onMessage(String payload) {
        telemetryRepository.savePayload(payload)
                .ifPresent(telemetryBroadcastService::broadcast);
    }
}
