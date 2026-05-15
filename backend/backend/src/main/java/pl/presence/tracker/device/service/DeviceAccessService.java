package pl.presence.tracker.device.service;

import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import pl.presence.tracker.device.model.UserDeviceAccess;
import pl.presence.tracker.device.repository.DeviceRepository;
import pl.presence.tracker.device.repository.UserDeviceAccessRepository;

@Service
public class DeviceAccessService {

    private final DeviceRepository deviceRepository;
    private final UserDeviceAccessRepository accessRepository;

    public DeviceAccessService(DeviceRepository deviceRepository, UserDeviceAccessRepository accessRepository) {
        this.deviceRepository = deviceRepository;
        this.accessRepository = accessRepository;
    }

    public DeviceAccessResult addAccess(Long userId, String deviceId) {
        if (!deviceRepository.existsById(deviceId)) {
            throw new NoSuchElementException("Device not found.");
        }

        boolean exists = accessRepository.existsByUserIdAndDeviceId(userId, deviceId);
        if (exists) {
            return new DeviceAccessResult(deviceId, false);
        }

        accessRepository.save(new UserDeviceAccess(userId, deviceId));
        return new DeviceAccessResult(deviceId, true);
    }

    public boolean removeAccess(Long userId, String deviceId) {
        long deleted = accessRepository.deleteByUserIdAndDeviceId(userId, deviceId);
        return deleted > 0;
    }

    public record DeviceAccessResult(String deviceId, boolean created) {
    }
}
