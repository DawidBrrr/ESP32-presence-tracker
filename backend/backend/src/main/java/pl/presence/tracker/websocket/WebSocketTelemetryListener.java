package pl.presence.tracker.websocket;

import java.security.Principal;
import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import pl.presence.tracker.device.model.UserDeviceAccess;
import pl.presence.tracker.device.repository.UserDeviceAccessRepository;
import pl.presence.tracker.security.JwtPrincipal;
import pl.presence.tracker.telemetry.model.TelemetryPoint;
import pl.presence.tracker.telemetry.repository.TelemetryRepository;
import pl.presence.tracker.websocket.dto.TelemetryUpdate;

@Component
public class WebSocketTelemetryListener {

    private static final String TELEMETRY_DESTINATION = "/user/queue/telemetry";

    private final UserDeviceAccessRepository accessRepository;
    private final TelemetryRepository telemetryRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketTelemetryListener(UserDeviceAccessRepository accessRepository,
            TelemetryRepository telemetryRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.accessRepository = accessRepository;
        this.telemetryRepository = telemetryRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        if (!TELEMETRY_DESTINATION.equals(accessor.getDestination())) {
            return;
        }

        Principal principal = accessor.getUser();
        Long userId = resolveUserId(principal);
        if (userId == null) {
            return;
        }

        List<UserDeviceAccess> accessList = accessRepository.findByUserId(userId);
        for (UserDeviceAccess access : accessList) {
            telemetryRepository.findLatest(access.getDeviceId())
                    .map(TelemetryUpdate::from)
                    .ifPresent(update -> messagingTemplate.convertAndSendToUser(
                            userId.toString(), "/queue/telemetry", update));
        }
    }

    private Long resolveUserId(Principal principal) {
        if (principal instanceof JwtPrincipal jwtPrincipal) {
            return jwtPrincipal.userId();
        }
        if (principal != null) {
            try {
                return Long.valueOf(principal.getName());
            } catch (NumberFormatException ex) {
                return null;
            }
        }
        return null;
    }
}
