package pl.presence.tracker.user.dto;

import pl.presence.tracker.user.model.AppUser;

public record AuthResponse(Long id, String username, String email) {

    public static AuthResponse from(AppUser user) {
        return new AuthResponse(user.getId(), user.getUsername(), user.getEmail());
    }
}
