package pl.presence.tracker.websocket;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import pl.presence.tracker.device.model.UserDeviceAccess;
import pl.presence.tracker.device.repository.UserDeviceAccessRepository;
import pl.presence.tracker.telemetry.model.TelemetryPoint;
import pl.presence.tracker.websocket.dto.TelemetryUpdate;

@Service
public class TelemetryBroadcastService {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserDeviceAccessRepository accessRepository;

    public TelemetryBroadcastService(SimpMessagingTemplate messagingTemplate,
            UserDeviceAccessRepository accessRepository) {
        this.messagingTemplate = messagingTemplate;
        this.accessRepository = accessRepository;
    }

    public void broadcast(TelemetryPoint telemetry) {
        List<UserDeviceAccess> accessList = accessRepository.findByDeviceId(telemetry.deviceId());
        if (accessList.isEmpty()) {
            return;
        }

        TelemetryUpdate update = TelemetryUpdate.from(telemetry);
        for (UserDeviceAccess access : accessList) {
            String userKey = access.getUserId().toString();
            messagingTemplate.convertAndSendToUser(userKey, "/queue/telemetry", update);
        }
    }
}
