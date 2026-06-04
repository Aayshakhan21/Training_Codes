package com.appverse.repository;

import com.appverse.entity.AppPurchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppPurchaseRepository extends JpaRepository<AppPurchase, Long> {
    boolean existsByUserIdAndAppId(Long userId, Long appId);

    Optional<AppPurchase> findTopByUserIdAndAppIdOrderByPurchasedAtDesc(Long userId, Long appId);

    void deleteByUserIdAndAppId(Long userId, Long appId);
}
