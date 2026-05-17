package pl.presence.tracker.device.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import pl.presence.tracker.device.dto.DeviceLastTelemetryResponse;
import pl.presence.tracker.device.model.UserDeviceAccess;
import pl.presence.tracker.device.repository.DeviceRepository;
import pl.presence.tracker.device.repository.UserDeviceAccessRepository;
import pl.presence.tracker.telemetry.repository.TelemetryRepository;

@Service
public class DeviceAccessService {

    private final DeviceRepository deviceRepository;
    private final UserDeviceAccessRepository accessRepository;
    private final TelemetryRepository telemetryRepository;

    public DeviceAccessService(DeviceRepository deviceRepository,
            UserDeviceAccessRepository accessRepository,
            TelemetryRepository telemetryRepository) {
        this.deviceRepository = deviceRepository;
        this.accessRepository = accessRepository;
        this.telemetryRepository = telemetryRepository;
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

    public List<DeviceLastTelemetryResponse> getLatestTelemetry(Long userId) {
        List<UserDeviceAccess> accessList = accessRepository.findByUserId(userId);
        List<DeviceLastTelemetryResponse> result = new ArrayList<>();
        for (UserDeviceAccess access : accessList) {
            telemetryRepository.findLatest(access.getDeviceId())
                    .map(DeviceLastTelemetryResponse::from)
                    .ifPresent(result::add);
        }
        return result;
    }

    public record DeviceAccessResult(String deviceId, boolean created) {
    }
}
