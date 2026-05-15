package pl.presence.tracker.device.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import pl.presence.tracker.device.dto.DeviceRegisterRequest;
import pl.presence.tracker.device.model.Device;
import pl.presence.tracker.device.repository.DeviceRepository;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final String registrationToken;

    public DeviceService(DeviceRepository deviceRepository,
            @Value("${device.registration.token}") String registrationToken) {
        this.deviceRepository = deviceRepository;
        this.registrationToken = registrationToken;
    }

    public DeviceRegistrationResult register(DeviceRegisterRequest request) {
        if (registrationToken == null || registrationToken.isBlank()) {
            throw new IllegalStateException("Device registration token is not configured.");
        }
        if (!registrationToken.equals(request.token())) {
            throw new IllegalArgumentException("Invalid device token.");
        }

        Optional<Device> existing = deviceRepository.findById(request.deviceId());
        if (existing.isPresent()) {
            return new DeviceRegistrationResult(existing.get(), false);
        }

        Device device = new Device(request.deviceId(), request.deviceId());
        return new DeviceRegistrationResult(deviceRepository.save(device), true);
    }

    public record DeviceRegistrationResult(Device device, boolean created) {
    }
}
