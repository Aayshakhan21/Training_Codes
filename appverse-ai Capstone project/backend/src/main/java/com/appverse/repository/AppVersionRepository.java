package com.appverse.repository;

import com.appverse.entity.AppVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppVersionRepository extends JpaRepository<AppVersion, Long> {
    List<AppVersion> findByAppIdOrderByCreatedAtDesc(Long appId);
    AppVersion findTopByAppIdOrderByCreatedAtDesc(Long appId);
}
