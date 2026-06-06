package pl.presence.tracker.device.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import pl.presence.tracker.device.dto.DeviceLastTelemetryResponse;
import pl.presence.tracker.device.dto.DeviceSummaryResponse;
import pl.presence.tracker.device.model.Device;
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

    @org.springframework.transaction.annotation.Transactional
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

    public List<DeviceSummaryResponse> getDevices(Long userId) {
        List<UserDeviceAccess> accessList = accessRepository.findByUserId(userId);
        if (accessList.isEmpty()) {
            return List.of();
        }

        List<String> deviceIds = accessList.stream()
                .map(UserDeviceAccess::getDeviceId)
                .distinct()
                .toList();

        List<Device> devices = deviceRepository.findAllById(deviceIds);
        Map<String, Device> byId = devices.stream()
                .collect(Collectors.toMap(Device::getId, device -> device));

        List<DeviceSummaryResponse> result = new ArrayList<>();
        for (String deviceId : deviceIds) {
            Device device = byId.get(deviceId);
            if (device != null) {
                result.add(DeviceSummaryResponse.from(device));
            }
        }
        return result;
    }

    public record DeviceAccessResult(String deviceId, boolean created) {
    }
}
