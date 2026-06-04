package com.appverse.repository;

import com.appverse.entity.DeveloperFollow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeveloperFollowRepository extends JpaRepository<DeveloperFollow, Long> {
    Optional<DeveloperFollow> findByFollowerIdAndDeveloperId(Long followerId, Long developerId);
    boolean existsByFollowerIdAndDeveloperId(Long followerId, Long developerId);
    List<DeveloperFollow> findByFollowerIdOrderByCreatedAtDesc(Long followerId);
}
