package pl.presence.tracker.device.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DeviceAccessResponse(
        @JsonProperty("id") String id,
        boolean created) {

    public static DeviceAccessResponse from(String id, boolean created) {
        return new DeviceAccessResponse(id, created);
    }
}
