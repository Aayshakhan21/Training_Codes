package com.appverse.repository;

import com.appverse.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByAppId(Long appId, Pageable pageable);
    Optional<Review> findByAppIdAndUserId(Long appId, Long userId);
    boolean existsByAppIdAndUserId(Long appId, Long userId);
    List<Review> findByIsFlagged(Boolean isFlagged);
    long countByAppId(Long appId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.app.id = :appId")
    Double avgRatingByApp(@Param("appId") Long appId);

    @Query("SELECT r FROM Review r WHERE r.user.id = :uid ORDER BY r.createdAt DESC")
    List<Review> findByUserId(@Param("uid") Long userId);
}
