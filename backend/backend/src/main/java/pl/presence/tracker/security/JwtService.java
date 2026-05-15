package pl.presence.tracker.security;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import pl.presence.tracker.user.model.AppUser;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationMillis;
    private final String issuer;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-minutes:60}") long expirationMinutes,
            @Value("${jwt.issuer:presence-tracker}") String issuer) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT secret is not configured.");
        }
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = Duration.ofMinutes(expirationMinutes).toMillis();
        this.issuer = issuer;
    }

    public String createToken(AppUser user) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(expirationMillis);

        return Jwts.builder()
                .subject(user.getUsername())
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .claim("uid", user.getId())
                .claim("email", user.getEmail())
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public Optional<JwtPrincipal> parseToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            if (issuer != null && !issuer.isBlank()) {
                String tokenIssuer = claims.getIssuer();
                if (tokenIssuer == null || !issuer.equals(tokenIssuer)) {
                    return Optional.empty();
                }
            }

            Number userIdValue = claims.get("uid", Number.class);
            Long userId = userIdValue == null ? null : userIdValue.longValue();
            String username = claims.getSubject();
            String email = claims.get("email", String.class);

            if (username == null || username.isBlank()) {
                return Optional.empty();
            }

            return Optional.of(new JwtPrincipal(userId, username, email));
        } catch (JwtException | IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
