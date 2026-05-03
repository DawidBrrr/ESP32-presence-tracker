package pl.presence.tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pl.presence.tracker.model.DeviceTelemetry;

public interface DeviceTelemetryRepository extends JpaRepository<DeviceTelemetry, String> {
}
