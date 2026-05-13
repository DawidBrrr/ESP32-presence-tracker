package pl.presence.tracker.telemetry.model;

import java.time.Instant;

public record TelemetryPoint(String deviceId, int count, Instant timestamp) {
}
