package pl.presence.tracker.device.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import pl.presence.tracker.telemetry.model.TelemetryPoint;

public record DeviceLastTelemetryResponse(
        @JsonProperty("id") String id,
        int count,
        Instant timestamp) {

    public static DeviceLastTelemetryResponse from(TelemetryPoint telemetry) {
        return new DeviceLastTelemetryResponse(telemetry.deviceId(), telemetry.count(), telemetry.timestamp());
    }
}
