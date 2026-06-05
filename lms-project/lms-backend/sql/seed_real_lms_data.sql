-- Realistic seed data for LMS project (MySQL)
-- Usage:
-- 1) Create DB: CREATE DATABASE lmsdb;
-- 2) Ensure app tables are created by running backend once.
-- 3) Run this file on lmsdb.

USE lmsdb;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE student_course;
TRUNCATE TABLE students;
TRUNCATE TABLE courses;
SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE courses ADD COLUMN image_url VARCHAR(500);
ALTER TABLE courses ADD COLUMN published_by VARCHAR(255);
ALTER TABLE courses ADD COLUMN badge VARCHAR(100);
ALTER TABLE courses ADD COLUMN rating DOUBLE;
ALTER TABLE courses ADD COLUMN rating_count INT;
ALTER TABLE courses ADD COLUMN price_inr DOUBLE;
ALTER TABLE courses ADD COLUMN list_price_inr DOUBLE;

-- ------------------------------------------------------------------
-- Courses (realistic catalog-style data)
-- ------------------------------------------------------------------
INSERT INTO courses (id, course_name, instructor, category, level, duration, image_url, published_by, badge, rating, rating_count, price_inr, list_price_inr, description) VALUES
(1, 'Python for Data Analysis and Automation', 'Jose Portilla', 'Data Science', 'Beginner', '10 weeks',
 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80', '365 Careers', 'Bestseller', 4.8, 21075, 459.00, 3089.00,
 'Learn Python fundamentals, pandas, NumPy, and practical automation workflows used in analytics teams.'),
(2, 'The Complete SQL Bootcamp for Analytics', 'Sonia Malik', 'Data Engineering', 'Beginner', '8 weeks',
 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80', 'Data School', 'Trending', 4.7, 18420, 549.00, 3299.00,
 'Master SQL querying, joins, CTEs, window functions, and reporting patterns for business analytics.'),
(3, 'Java Spring Boot Microservices in Practice', 'Ramesh Nair', 'Backend Development', 'Intermediate', '12 weeks',
 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80', 'CodeCraft Academy', 'Top Rated', 4.6, 14230, 699.00, 3999.00,
 'Build REST APIs, secure services, and production-ready microservices with Spring Boot and MySQL.'),
(4, 'React and TypeScript Frontend Masterclass', 'Aman Gupta', 'Frontend Development', 'Intermediate', '10 weeks',
 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80', 'Frontend Pro', 'Bestseller', 4.7, 19654, 599.00, 3599.00,
 'Create modern SPA interfaces using React, TypeScript, routing, state management, and API integration.'),
(5, 'AWS Cloud Practitioner to Architect Path', 'Priya Menon', 'Cloud Computing', 'Intermediate', '14 weeks',
 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', 'Cloud Academy', 'Popular', 4.5, 11220, 799.00, 4299.00,
 'Hands-on cloud learning with IAM, EC2, S3, VPC, monitoring, and architecture decision patterns.'),
(6, 'Machine Learning Foundations with Scikit-learn', 'Andrew Kim', 'Machine Learning', 'Intermediate', '12 weeks',
 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80', 'AI Lab', 'Top Rated', 4.6, 17310, 749.00, 4499.00,
 'Build supervised models, evaluate performance, tune hyperparameters, and deploy basic ML pipelines.'),
(7, 'DevOps CI/CD with Docker and GitHub Actions', 'Kunal Verma', 'DevOps', 'Intermediate', '9 weeks',
 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80', 'DevOps Hub', 'Trending', 4.5, 9860, 649.00, 3499.00,
 'Design CI/CD pipelines, containerize apps, and automate quality checks and deployments.'),
(8, 'Product Management: Build and Launch Digital Products', 'Neha Sethi', 'Product Management', 'Beginner', '6 weeks',
 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', 'PM School', 'Popular', 4.4, 7560, 529.00, 2999.00,
 'Learn product discovery, prioritization, roadmapping, and stakeholder communication with practical templates.'),
(9, 'System Design Interview Preparation', 'Gaurav Sen', 'Software Engineering', 'Advanced', '8 weeks',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', 'InterviewReady', 'Top Rated', 4.8, 22340, 899.00, 4999.00,
 'Design scalable systems, APIs, data models, queues, caching layers, and tradeoff-focused architectures.'),
(10, 'Cybersecurity Fundamentals and Risk Management', 'Anita Rao', 'Cybersecurity', 'Beginner', '7 weeks',
 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80', 'SecureSphere', 'New', 4.5, 6340, 579.00, 3199.00,
 'Understand threat models, secure coding basics, IAM, logging, and compliance-driven risk reduction.');

-- ------------------------------------------------------------------
-- Students (realistic learner profile data)
-- ------------------------------------------------------------------
INSERT INTO students (id, student_name, email, grade, join_date) VALUES
(1, 'Aarav Sharma', 'aarav.sharma@learnmail.com', 'A',  '2026-03-03'),
(2, 'Ananya Verma', 'ananya.verma@learnmail.com', 'A-', '2026-03-11'),
(3, 'Rohan Mehta', 'rohan.mehta@learnmail.com', 'B+', '2026-03-18'),
(4, 'Priya Nair', 'priya.nair@learnmail.com', 'A+', '2026-03-24'),
(5, 'Karthik Reddy', 'karthik.reddy@learnmail.com', 'B',  '2026-04-02'),
(6, 'Sneha Iyer', 'sneha.iyer@learnmail.com', 'A',  '2026-04-09'),
(7, 'Aditya Kulkarni', 'aditya.kulkarni@learnmail.com', 'B+', '2026-04-14'),
(8, 'Ishita Choudhary', 'ishita.choudhary@learnmail.com', 'A-', '2026-04-19'),
(9, 'Vikram Singh', 'vikram.singh@learnmail.com', 'B',  '2026-04-27'),
(10, 'Kavya Menon', 'kavya.menon@learnmail.com', 'A',  '2026-05-01'),
(11, 'Rahul Patil', 'rahul.patil@learnmail.com', 'B+', '2026-05-06'),
(12, 'Neha Gupta', 'neha.gupta@learnmail.com', 'A+', '2026-05-12');

-- ------------------------------------------------------------------
-- Enrollments (many-to-many student_course)
-- ------------------------------------------------------------------
INSERT INTO student_course (student_id, course_id) VALUES
-- Aarav
(1, 1), (1, 2), (1, 4),
-- Ananya
(2, 2), (2, 3), (2, 7),
-- Rohan
(3, 1), (3, 6), (3, 10),
-- Priya
(4, 3), (4, 4), (4, 9),
-- Karthik
(5, 5), (5, 7), (5, 10),
-- Sneha
(6, 1), (6, 6), (6, 8),
-- Aditya
(7, 2), (7, 3), (7, 9),
-- Ishita
(8, 4), (8, 5), (8, 8),
-- Vikram
(9, 3), (9, 7), (9, 10),
-- Kavya
(10, 1), (10, 2), (10, 6),
-- Rahul
(11, 4), (11, 5), (11, 9),
-- Neha
(12, 6), (12, 8), (12, 10);

-- ------------------------------------------------------------------
-- Optional app users (non-admin learner accounts for login)
-- BCrypt hash used below corresponds to plain password: password123
-- Test login users in this seed:
-- aarav.s / password123
-- ananya.v / password123
-- priya.n / password123
-- ------------------------------------------------------------------
INSERT INTO app_users (username, password, name, role) VALUES
('aarav.s', '$2a$10$7m6n6IqmKgcYhG9jK5wMqu1mVZ7Vx4fF7U3nqf4m7A2nVrZfA8P6W', 'Aarav Sharma', 'USER'),
('ananya.v', '$2a$10$7m6n6IqmKgcYhG9jK5wMqu1mVZ7Vx4fF7U3nqf4m7A2nVrZfA8P6W', 'Ananya Verma', 'USER'),
('priya.n', '$2a$10$7m6n6IqmKgcYhG9jK5wMqu1mVZ7Vx4fF7U3nqf4m7A2nVrZfA8P6W', 'Priya Nair', 'USER')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
role = VALUES(role);

-- NOTE:
-- Default admin is still seeded by backend startup:
-- username: admin
-- password: admin123
