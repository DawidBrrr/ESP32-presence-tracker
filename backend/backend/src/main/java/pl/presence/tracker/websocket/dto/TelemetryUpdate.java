package pl.presence.tracker.websocket.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import pl.presence.tracker.telemetry.model.TelemetryPoint;

public record TelemetryUpdate(
        @JsonProperty("id") String id,
        int count,
        Instant timestamp) {

    public static TelemetryUpdate from(TelemetryPoint telemetry) {
        return new TelemetryUpdate(telemetry.deviceId(), telemetry.count(), telemetry.timestamp());
    }
}
