package com.appverse.repository;

import com.appverse.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DownloadRepository extends JpaRepository<Download, Long> {
    long countByAppId(Long appId);

    @Query("SELECT COUNT(d) FROM Download d WHERE d.downloadedAt >= :since")
    long countSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(d) FROM Download d WHERE d.downloadedAt BETWEEN :start AND :end")
    long countByDownloadedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT d.app.id, COUNT(d) as cnt FROM Download d " +
           "WHERE d.downloadedAt >= :since GROUP BY d.app.id ORDER BY cnt DESC")
    List<Object[]> topDownloadedSince(@Param("since") LocalDateTime since);

    List<Download> findByUserId(Long userId);
    Page<Download> findByUserIdOrderByDownloadedAtDesc(Long userId, Pageable pageable);
    List<Download> findByUserIdAndAppId(Long userId, Long appId);
    void deleteByUserIdAndAppId(Long userId, Long appId);
    java.util.Optional<Download> findByIdAndUserId(Long id, Long userId);
    List<Download> findByAppId(Long appId);
    List<Download> findByDownloadedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT d FROM Download d WHERE d.app.developer.id = :developerId AND d.downloadedAt BETWEEN :start AND :end")
    List<Download> findByDeveloperAndDownloadedAtBetween(
            @Param("developerId") Long developerId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT d FROM Download d WHERE d.app.developer.id = :developerId ORDER BY d.downloadedAt DESC")
    Page<Download> findRecentByDeveloper(
            @Param("developerId") Long developerId,
            Pageable pageable);

    @Query("SELECT COUNT(d) FROM Download d WHERE d.app.developer.id = :devId")
    long countByDeveloper(@Param("devId") Long developerId);
}
