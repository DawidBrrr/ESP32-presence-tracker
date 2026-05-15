package pl.presence.tracker.device.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.presence.tracker.device.dto.DeviceRegisterRequest;
import pl.presence.tracker.device.dto.DeviceResponse;
import pl.presence.tracker.device.dto.ErrorResponse;
import pl.presence.tracker.device.service.DeviceService;
import pl.presence.tracker.device.service.DeviceService.DeviceRegistrationResult;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody DeviceRegisterRequest request) {
        try {
            DeviceRegistrationResult result = deviceService.register(request);
            HttpStatus status = result.created() ? HttpStatus.CREATED : HttpStatus.OK;
            return ResponseEntity.status(status).body(DeviceResponse.from(result.device()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(ex.getMessage()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(ex.getMessage()));
        }
    }
}
