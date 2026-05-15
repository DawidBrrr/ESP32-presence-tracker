package pl.presence.tracker.device.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_device_access")
@IdClass(UserDeviceAccessId.class)
public class UserDeviceAccess {

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Id
    @Column(name = "device_id", nullable = false, length = 50)
    private String deviceId;

    protected UserDeviceAccess() {
    }

    public UserDeviceAccess(Long userId, String deviceId) {
        this.userId = userId;
        this.deviceId = deviceId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getDeviceId() {
        return deviceId;
    }
}
