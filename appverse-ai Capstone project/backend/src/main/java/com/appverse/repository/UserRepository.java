package com.appverse.repository;

import com.appverse.entity.User;
import com.appverse.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Page<User> findByRole(Role role, Pageable pageable);
    Page<User> findByRoleAndEmailContainingIgnoreCaseOrRoleAndUsernameContainingIgnoreCase(
            Role role1, String email, Role role2, String username, Pageable pageable);
    List<User> findAllByRole(Role role);
    long countByRole(Role role);
    long countByIsActive(Boolean active);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
