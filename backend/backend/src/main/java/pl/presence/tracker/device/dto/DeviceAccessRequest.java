package pl.presence.tracker.device.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DeviceAccessRequest(
        @JsonProperty("id")
        @NotBlank @Size(max = 50) String id) {
}
