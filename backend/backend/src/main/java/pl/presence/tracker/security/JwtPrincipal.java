package pl.presence.tracker.security;

import java.security.Principal;

public record JwtPrincipal(Long userId, String username, String email) implements Principal {

	@Override
	public String getName() {
		if (userId != null) {
			return userId.toString();
		}
		return username == null ? "" : username;
	}
}
