package pl.presence.tracker.device.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pl.presence.tracker.device.model.UserDeviceAccess;
import pl.presence.tracker.device.model.UserDeviceAccessId;

public interface UserDeviceAccessRepository extends JpaRepository<UserDeviceAccess, UserDeviceAccessId> {

    boolean existsByUserIdAndDeviceId(Long userId, String deviceId);

    long deleteByUserIdAndDeviceId(Long userId, String deviceId);

    List<UserDeviceAccess> findByUserId(Long userId);

    List<UserDeviceAccess> findByDeviceId(String deviceId);
}
