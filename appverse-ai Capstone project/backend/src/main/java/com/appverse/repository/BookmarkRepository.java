package com.appverse.repository;

import com.appverse.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Bookmark> findByUserIdAndAppId(Long userId, Long appId);
    boolean existsByUserIdAndAppId(Long userId, Long appId);
    long countByAppId(Long appId);
}
