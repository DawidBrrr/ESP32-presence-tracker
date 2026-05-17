package pl.presence.tracker.device.controller;

import java.util.List;
import java.util.NoSuchElementException;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.presence.tracker.device.dto.DeviceAccessRequest;
import pl.presence.tracker.device.dto.DeviceAccessResponse;
import pl.presence.tracker.device.dto.DeviceLastTelemetryResponse;
import pl.presence.tracker.device.dto.ErrorResponse;
import pl.presence.tracker.device.service.DeviceAccessService;
import pl.presence.tracker.device.service.DeviceAccessService.DeviceAccessResult;
import pl.presence.tracker.security.JwtPrincipal;

@RestController
@RequestMapping("/api/user/devices")
public class DeviceAccessController {

    private final DeviceAccessService deviceAccessService;

    public DeviceAccessController(DeviceAccessService deviceAccessService) {
        this.deviceAccessService = deviceAccessService;
    }

    @PostMapping
    public ResponseEntity<?> addDevice(@AuthenticationPrincipal JwtPrincipal principal,
            @Valid @RequestBody DeviceAccessRequest request) {
        if (principal == null || principal.userId() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid token."));
        }

        try {
            DeviceAccessResult result = deviceAccessService.addAccess(principal.userId(), request.id());
            HttpStatus status = result.created() ? HttpStatus.CREATED : HttpStatus.OK;
            return ResponseEntity.status(status)
                    .body(DeviceAccessResponse.from(result.deviceId(), result.created()));
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeDevice(@AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable String id) {
        if (principal == null || principal.userId() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid token."));
        }

        boolean removed = deviceAccessService.removeAccess(principal.userId(), id);
        if (!removed) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Device access not found."));
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/last")
    public ResponseEntity<?> getLatestTelemetry(@AuthenticationPrincipal JwtPrincipal principal) {
        if (principal == null || principal.userId() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid token."));
        }

        List<DeviceLastTelemetryResponse> result = deviceAccessService.getLatestTelemetry(principal.userId());
        return ResponseEntity.ok(result);
    }
}
