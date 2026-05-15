package pl.presence.tracker.device.dto;

import pl.presence.tracker.device.model.Device;

public record DeviceResponse(String id, String name) {

    public static DeviceResponse from(Device device) {
        return new DeviceResponse(device.getId(), device.getName());
    }
}
