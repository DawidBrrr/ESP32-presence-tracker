package pl.presence.tracker.user.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import pl.presence.tracker.user.dto.LoginRequest;
import pl.presence.tracker.user.dto.RegisterRequest;
import pl.presence.tracker.user.model.AppUser;
import pl.presence.tracker.user.model.AuthProvider;
import pl.presence.tracker.user.repository.AppUserRepository;

@Service
public class UserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser register(RegisterRequest request) {
        if (appUserRepository.existsByUsername(request.username())
                || appUserRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("Username or email already in use.");
        }

        String passwordHash = passwordEncoder.encode(request.password());
        AppUser user = new AppUser(request.username(), request.email(), passwordHash, AuthProvider.LOCAL);
        return appUserRepository.save(user);
    }

    public Optional<AppUser> login(LoginRequest request) {
        Optional<AppUser> user = appUserRepository.findByEmail(request.usernameOrEmail());
        if (user.isEmpty()) {
            user = appUserRepository.findByUsername(request.usernameOrEmail());
        }
        if (user.isEmpty()) {
            return Optional.empty();
        }

        AppUser appUser = user.get();
        if (appUser.getAuthProvider() != AuthProvider.LOCAL) {
            return Optional.empty();
        }
        String passwordHash = appUser.getPasswordHash();
        if (passwordHash == null || !passwordEncoder.matches(request.password(), passwordHash)) {
            return Optional.empty();
        }

        return Optional.of(appUser);
    }
}
