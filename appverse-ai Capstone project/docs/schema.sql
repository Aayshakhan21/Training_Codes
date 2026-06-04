-- ============================================================
-- AppVerse AI – MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS appverse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE appverse_db;

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
CREATE TABLE users (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(50)  NOT NULL UNIQUE,
    email        VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    full_name    VARCHAR(100),
    avatar_url   VARCHAR(500),
    role         ENUM('USER','DEVELOPER','ADMIN') NOT NULL DEFAULT 'USER',
    is_active    BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- REFRESH TOKENS
-- ─────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    token        VARCHAR(500) NOT NULL UNIQUE,
    user_id      BIGINT NOT NULL,
    expiry_date  TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────
CREATE TABLE categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon        VARCHAR(100),
    color       VARCHAR(20),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- APPS
-- ─────────────────────────────────────────
CREATE TABLE apps (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(150) NOT NULL,
    slug             VARCHAR(150) NOT NULL UNIQUE,
    description      TEXT,
    short_desc       VARCHAR(300),
    icon_url         VARCHAR(500),
    banner_url       VARCHAR(500),
    screenshots      JSON,
    version          VARCHAR(20) DEFAULT '1.0.0',
    release_notes    TEXT,
    developer_id     BIGINT NOT NULL,
    category_id      BIGINT NOT NULL,
    price            DECIMAL(10,2) DEFAULT 0.00,
    download_count   INT DEFAULT 0,
    avg_rating       DECIMAL(3,2) DEFAULT 0.00,
    review_count     INT DEFAULT 0,
    trending_score   DECIMAL(10,4) DEFAULT 0.00,
    status           ENUM('PENDING','APPROVED','REJECTED','SUSPENDED') DEFAULT 'PENDING',
    tags             JSON,
    size_mb          DECIMAL(8,2),
    min_os_version   VARCHAR(20),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (developer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category (category_id),
    INDEX idx_developer (developer_id),
    INDEX idx_status (status),
    INDEX idx_trending (trending_score DESC),
    FULLTEXT INDEX ft_search (name, description, short_desc)
);

-- ─────────────────────────────────────────
-- APP VERSIONS
-- ─────────────────────────────────────────
CREATE TABLE app_versions (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    app_id        BIGINT NOT NULL,
    version       VARCHAR(20) NOT NULL,
    release_notes TEXT,
    download_url  VARCHAR(500),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────
CREATE TABLE reviews (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    app_id           BIGINT NOT NULL,
    user_id          BIGINT NOT NULL,
    rating           TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title            VARCHAR(200),
    content          TEXT,
    sentiment        ENUM('POSITIVE','NEGATIVE','NEUTRAL') DEFAULT 'NEUTRAL',
    sentiment_score  DECIMAL(5,4) DEFAULT 0.5000,
    is_flagged       BOOLEAN DEFAULT FALSE,
    is_fake          BOOLEAN DEFAULT FALSE,
    helpful_count    INT DEFAULT 0,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_app (user_id, app_id),
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- DOWNLOADS
-- ─────────────────────────────────────────
CREATE TABLE downloads (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    app_id       BIGINT NOT NULL,
    user_id      BIGINT,
    ip_address   VARCHAR(45),
    platform     VARCHAR(50),
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_app_downloads (app_id),
    INDEX idx_date (downloaded_at)
);

-- ─────────────────────────────────────────
-- BOOKMARKS / FAVORITES
-- ─────────────────────────────────────────
CREATE TABLE bookmarks (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    app_id     BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_bookmark (user_id, app_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- USER CATEGORY INTERESTS (for recommendations)
-- ─────────────────────────────────────────
CREATE TABLE user_category_interests (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    score       DECIMAL(8,4) DEFAULT 1.0,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_cat (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- EMAIL NOTIFICATIONS LOG
-- ─────────────────────────────────────────
CREATE TABLE notification_logs (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT,
    type       VARCHAR(50),
    subject    VARCHAR(200),
    sent_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status     ENUM('SENT','FAILED') DEFAULT 'SENT'
);

-- ─────────────────────────────────────────
-- SEED: CATEGORIES
-- ─────────────────────────────────────────
INSERT INTO categories (name, description, icon, color) VALUES
('Productivity',   'Tools to boost your efficiency',           'briefcase',    '#6366F1'),
('Entertainment',  'Games, media and fun',                     'film',         '#EC4899'),
('Education',      'Learn and grow with smart tools',          'graduation-cap','#10B981'),
('Finance',        'Manage money and investments',             'dollar-sign',  '#F59E0B'),
('Health',         'Fitness, wellness and medical',            'heart',        '#EF4444'),
('Social',         'Connect with people',                      'users',        '#3B82F6'),
('Utilities',      'System and device tools',                  'tool',         '#8B5CF6'),
('Travel',         'Navigation and travel planning',           'map',          '#14B8A6'),
('Shopping',       'E-commerce and deal finders',              'shopping-cart','#F97316'),
('News',           'Stay updated with the world',              'newspaper',    '#64748B');

-- ─────────────────────────────────────────
-- SEED: ADMIN USER  (password: Test@123)
-- ─────────────────────────────────────────
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@appverse.ai',
 '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS',
 'AppVerse Admin', 'ADMIN');
