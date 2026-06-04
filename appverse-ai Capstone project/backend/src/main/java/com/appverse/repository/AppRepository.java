package com.appverse.repository;

import com.appverse.entity.App;
import com.appverse.enums.AppStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppRepository extends JpaRepository<App, Long> {

    Optional<App> findBySlug(String slug);

    Page<App> findByStatus(AppStatus status, Pageable pageable);

    Page<App> findByCategoryIdAndStatus(Long categoryId, AppStatus status, Pageable pageable);

    Page<App> findByDeveloperIdAndStatus(Long developerId, AppStatus status, Pageable pageable);

    List<App> findByDeveloperId(Long developerId);

    @Query("SELECT a FROM App a WHERE a.status = 'APPROVED' AND (" +
           "LOWER(a.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.shortDesc) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.tags) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.developer.username) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.developer.fullName) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<App> searchApps(@Param("q") String query, Pageable pageable);

    @Query("SELECT a FROM App a WHERE a.status = 'APPROVED' ORDER BY a.trendingScore DESC")
    List<App> findTrendingApps(Pageable pageable);

    @Query("SELECT a FROM App a WHERE a.status = 'APPROVED' ORDER BY a.avgRating DESC, a.reviewCount DESC")
    List<App> findTopRatedApps(Pageable pageable);

    @Query("SELECT a FROM App a WHERE a.category.id = :catId AND a.status = 'APPROVED' " +
           "AND a.id <> :appId ORDER BY a.avgRating DESC")
    List<App> findSimilarApps(@Param("catId") Long categoryId,
                               @Param("appId") Long appId,
                               Pageable pageable);

    long countByStatus(AppStatus status);

    @Query("SELECT SUM(a.downloadCount) FROM App a WHERE a.developer.id = :devId")
    Long sumDownloadsByDeveloper(@Param("devId") Long developerId);

    @Query("SELECT SUM(a.price * a.downloadCount) FROM App a WHERE a.developer.id = :devId")
    Double sumRevenueByDeveloper(@Param("devId") Long developerId);
}
