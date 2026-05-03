package pl.presence.tracker.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "device_telemetry")
public class DeviceTelemetry {

    @Id
    @Column(name = "device_id", nullable = false, length = 128)
    private String deviceId;

    @Column(name = "people_count", nullable = false)
    private int peopleCount;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected DeviceTelemetry() {
    }

    public DeviceTelemetry(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public int getPeopleCount() {
        return peopleCount;
    }

    public void setPeopleCount(int peopleCount) {
        this.peopleCount = peopleCount;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
