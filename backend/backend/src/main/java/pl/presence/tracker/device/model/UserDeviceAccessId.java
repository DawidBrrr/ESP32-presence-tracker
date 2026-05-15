package pl.presence.tracker.device.model;

import java.io.Serializable;
import java.util.Objects;

public class UserDeviceAccessId implements Serializable {

    private Long userId;
    private String deviceId;

    public UserDeviceAccessId() {
    }

    public UserDeviceAccessId(Long userId, String deviceId) {
        this.userId = userId;
        this.deviceId = deviceId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserDeviceAccessId that = (UserDeviceAccessId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(deviceId, that.deviceId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, deviceId);
    }
}
