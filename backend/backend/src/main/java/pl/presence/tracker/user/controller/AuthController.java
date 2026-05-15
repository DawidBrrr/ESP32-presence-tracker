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
import pl.presence.tracker.security.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AppUser user = userService.register(request);
            String token = jwtService.createToken(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(AuthResponse.from(user, token));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(AuthResponse.from(user, jwtService.createToken(user))))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Invalid credentials.")));
    }
}
