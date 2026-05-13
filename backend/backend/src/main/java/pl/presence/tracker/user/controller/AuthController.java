package pl.presence.tracker.user.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.presence.tracker.user.dto.AuthResponse;
import pl.presence.tracker.user.dto.ErrorResponse;
import pl.presence.tracker.user.dto.LoginRequest;
import pl.presence.tracker.user.dto.RegisterRequest;
import pl.presence.tracker.user.model.AppUser;
import pl.presence.tracker.user.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AppUser user = userService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(AuthResponse.from(user));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(AuthResponse.from(user)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Invalid credentials.")));
    }
}
