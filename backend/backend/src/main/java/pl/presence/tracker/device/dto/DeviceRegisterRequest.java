package pl.presence.tracker.device.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DeviceRegisterRequest(
        @NotBlank @Size(max = 50) String id,
        @NotBlank String token) {
}
