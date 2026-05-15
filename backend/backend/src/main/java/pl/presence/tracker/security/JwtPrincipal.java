package pl.presence.tracker.security;

public record JwtPrincipal(Long userId, String username, String email) {
}
