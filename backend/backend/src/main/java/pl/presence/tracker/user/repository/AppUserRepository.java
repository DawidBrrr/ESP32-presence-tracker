package pl.presence.tracker.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import pl.presence.tracker.user.model.AppUser;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

    Optional<AppUser> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
