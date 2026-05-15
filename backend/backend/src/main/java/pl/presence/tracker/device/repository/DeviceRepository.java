package pl.presence.tracker.device.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pl.presence.tracker.device.model.Device;

public interface DeviceRepository extends JpaRepository<Device, String> {
}
