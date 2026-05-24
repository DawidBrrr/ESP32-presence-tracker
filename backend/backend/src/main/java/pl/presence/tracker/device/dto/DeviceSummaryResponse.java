package pl.presence.tracker.device.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import pl.presence.tracker.device.model.Device;

public record DeviceSummaryResponse(
        @JsonProperty("id") String id,
        String name) {

    public static DeviceSummaryResponse from(Device device) {
        return new DeviceSummaryResponse(device.getId(), device.getName());
    }
}
