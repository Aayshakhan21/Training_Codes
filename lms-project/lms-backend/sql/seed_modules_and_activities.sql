-- Extra LMS content seed: modules + activities + resource links
-- This file creates additional tables for richer "real LMS" content.
-- It does not break your existing app schema.

USE lmsdb;

CREATE TABLE IF NOT EXISTS course_modules (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_id BIGINT NOT NULL,
  module_title VARCHAR(255) NOT NULL,
  module_order INT NOT NULL,
  estimated_hours INT DEFAULT 2,
  learning_outcomes TEXT,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS module_activities (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  module_id BIGINT NOT NULL,
  activity_type VARCHAR(50) NOT NULL,   -- VIDEO, QUIZ, ASSIGNMENT, PROJECT, READING
  activity_title VARCHAR(255) NOT NULL,
  resource_link VARCHAR(500),
  points INT DEFAULT 0,
  due_in_days INT DEFAULT NULL,
  is_mandatory BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS module_parts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  module_id BIGINT NOT NULL,
  part_title VARCHAR(255) NOT NULL,
  part_order INT NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- INTRO, LESSON, DEMO, RECAP
  duration_minutes INT DEFAULT 15,
  resource_link VARCHAR(500),
  FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_activity_progress (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  activity_id BIGINT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, COMPLETED
  score INT DEFAULT NULL,
  submitted_at DATETIME DEFAULT NULL,
  UNIQUE KEY uq_student_activity (student_id, activity_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES module_activities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS help_faqs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS support_contacts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  icon VARCHAR(50) NOT NULL,
  label VARCHAR(100) NOT NULL,
  sub VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  color VARCHAR(20) DEFAULT '#3b82f6',
  sort_order INT DEFAULT 1
);

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE student_activity_progress;
TRUNCATE TABLE module_parts;
TRUNCATE TABLE module_activities;
TRUNCATE TABLE course_modules;
TRUNCATE TABLE help_faqs;
TRUNCATE TABLE support_contacts;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------
-- Modules (3 per course for 10 courses = 30 modules)
-- ---------------------------------------------------------------
INSERT INTO course_modules (course_id, module_title, module_order, estimated_hours, learning_outcomes) VALUES
-- Course 1
(1,'Python Basics and Jupyter Workflow',1,6,'Variables, loops, functions, notebooks'),
(1,'Data Analysis with pandas and NumPy',2,8,'Data cleaning, joins, aggregations'),
(1,'Automation Project: Reporting Pipeline',3,10,'Scripted ETL and scheduled reports'),
-- Course 2
(2,'SQL Fundamentals',1,5,'SELECT, WHERE, GROUP BY'),
(2,'Advanced SQL for Analytics',2,7,'CTE, window functions, subqueries'),
(2,'Business Reporting Case Study',3,8,'Build analytics-ready KPI reports'),
-- Course 3
(3,'Spring Boot API Foundations',1,8,'Controllers, services, repositories'),
(3,'Security and Validation',2,8,'Auth flow, validation, exception handling'),
(3,'Microservices Deployment',3,10,'Service decomposition and deployment'),
-- Course 4
(4,'React Core and Components',1,6,'Props, state, hooks'),
(4,'TypeScript and API Integration',2,8,'Typed models and async calls'),
(4,'Frontend Capstone Project',3,10,'Production-style UI implementation'),
-- Course 5
(5,'Cloud Fundamentals and IAM',1,6,'Core AWS services and IAM policy basics'),
(5,'Compute, Storage, Networking',2,8,'EC2, S3, VPC design'),
(5,'Architecture and Monitoring',3,10,'Well-architected design and observability'),
-- Course 6
(6,'ML Problem Framing',1,6,'Data split and evaluation metrics'),
(6,'Modeling with Scikit-learn',2,9,'Regression and classification workflows'),
(6,'Model Tuning and Packaging',3,9,'Hyperparameter tuning and deployment prep'),
-- Course 7
(7,'Containers with Docker',1,6,'Dockerfiles, images, compose'),
(7,'CI Pipelines with GitHub Actions',2,8,'Build/test automation'),
(7,'CD and Release Strategy',3,8,'Deployment flow and rollback patterns'),
-- Course 8
(8,'Product Discovery and Research',1,5,'User problems and discovery interviews'),
(8,'Prioritization and Roadmapping',2,6,'RICE/ICE and roadmap planning'),
(8,'Launch and Post-Launch Metrics',3,7,'Go-to-market and retention metrics'),
-- Course 9
(9,'System Design Fundamentals',1,6,'Scalability and reliability basics'),
(9,'Data and Caching Strategies',2,8,'DB tradeoffs and caching layers'),
(9,'Interview-Style Design Drills',3,9,'Whiteboard and tradeoff communication'),
-- Course 10
(10,'Security Basics and Threat Modeling',1,5,'CIA triad and attack surfaces'),
(10,'Secure Development Practices',2,7,'OWASP and secure coding'),
(10,'Risk Management and Compliance',3,7,'Policy, controls, and incident handling');

-- ---------------------------------------------------------------
-- Activities (REAL INDUSTRY-STYLE DATA)
-- ---------------------------------------------------------------
INSERT INTO module_activities
(module_id, activity_type, activity_title, resource_link, points, due_in_days, is_mandatory)
SELECT
m.id,
'VIDEO',
CASE
WHEN m.module_title LIKE '%Python Basics%' THEN 'Python for Beginners Full Course'
WHEN m.module_title LIKE '%Data Analysis%' THEN 'Pandas Data Analysis Project'
WHEN m.module_title LIKE '%SQL Fundamentals%' THEN 'SQL Complete Bootcamp'
WHEN m.module_title LIKE '%Advanced SQL%' THEN 'Advanced SQL Analytics'
WHEN m.module_title LIKE '%Spring Boot%' THEN 'Spring Boot REST API Development'
WHEN m.module_title LIKE '%Microservices%' THEN 'Spring Boot Microservices Architecture'
WHEN m.module_title LIKE '%React Core%' THEN 'React Complete Frontend Guide'
WHEN m.module_title LIKE '%TypeScript%' THEN 'React TypeScript Masterclass'
WHEN m.module_title LIKE '%Cloud Fundamentals%' THEN 'AWS Cloud Practitioner Training'
WHEN m.module_title LIKE '%Machine Learning%' THEN 'Machine Learning with Python'
WHEN m.module_title LIKE '%Docker%' THEN 'Docker Crash Course'
WHEN m.module_title LIKE '%GitHub Actions%' THEN 'CI/CD with GitHub Actions'
WHEN m.module_title LIKE '%System Design%' THEN 'System Design Interview Course'
WHEN m.module_title LIKE '%Security Basics%' THEN 'Cybersecurity Fundamentals'
ELSE CONCAT(m.module_title, ' - Video Lecture')
END,
CASE
WHEN m.module_title LIKE '%Python Basics%' THEN 'https://www.youtube.com/watch?v=rfscVS0vtbw'
WHEN m.module_title LIKE '%Data Analysis%' THEN 'https://www.youtube.com/watch?v=7S_tz1z_5bA'
WHEN m.module_title LIKE '%SQL Fundamentals%' THEN 'https://www.youtube.com/watch?v=HXV3zeQKqGY'
WHEN m.module_title LIKE '%Advanced SQL%' THEN 'https://www.youtube.com/watch?v=9ylj9NR0Lcg'
WHEN m.module_title LIKE '%Spring Boot%' THEN 'https://www.youtube.com/watch?v=vtPkZShrvXQ'
WHEN m.module_title LIKE '%Microservices%' THEN 'https://www.youtube.com/watch?v=9SGDpanrc8U'
WHEN m.module_title LIKE '%React Core%' THEN 'https://www.youtube.com/watch?v=bMknfKXIFA8'
WHEN m.module_title LIKE '%TypeScript%' THEN 'https://www.youtube.com/watch?v=SqcY0GlETPk'
WHEN m.module_title LIKE '%Cloud Fundamentals%' THEN 'https://www.youtube.com/watch?v=ulprqHHWlng'
WHEN m.module_title LIKE '%Machine Learning%' THEN 'https://www.youtube.com/watch?v=i_LwzRVP7bg'
WHEN m.module_title LIKE '%Docker%' THEN 'https://www.youtube.com/watch?v=3c-iBn73dDE'
WHEN m.module_title LIKE '%GitHub Actions%' THEN 'https://www.youtube.com/watch?v=RGOj5yH7evk'
WHEN m.module_title LIKE '%System Design%' THEN 'https://www.youtube.com/watch?v=UzLMhqg3_Wc'
WHEN m.module_title LIKE '%Security Basics%' THEN 'https://www.youtube.com/watch?v=inWWhr5tnEA'
ELSE 'https://www.youtube.com'
END,
10, 3, TRUE
FROM course_modules m;

-- REALISTIC READING MATERIALS
INSERT INTO module_activities
(module_id, activity_type, activity_title, resource_link, points, due_in_days, is_mandatory)
SELECT
m.id,
'READING',
CONCAT(m.module_title, ' - Documentation & Notes'),
CASE
WHEN m.module_title LIKE '%React%' THEN 'https://react.dev/'
WHEN m.module_title LIKE '%Spring Boot%' THEN 'https://spring.io/projects/spring-boot'
WHEN m.module_title LIKE '%SQL%' THEN 'https://www.w3schools.com/sql/'
WHEN m.module_title LIKE '%Cloud%' THEN 'https://docs.aws.amazon.com/'
WHEN m.module_title LIKE '%Docker%' THEN 'https://docs.docker.com/'
WHEN m.module_title LIKE '%Machine Learning%' THEN 'https://scikit-learn.org/stable/'
ELSE 'https://developer.mozilla.org/'
END,
5, 4, TRUE
FROM course_modules m;

-- REALISTIC QUIZZES
INSERT INTO module_activities
(module_id, activity_type, activity_title, resource_link, points, due_in_days, is_mandatory)
SELECT
m.id,
'QUIZ',
CASE
WHEN m.module_title LIKE '%React%' THEN 'React Hooks & Routing Quiz'
WHEN m.module_title LIKE '%Security%' THEN 'JWT Authentication Assessment'
WHEN m.module_title LIKE '%SQL%' THEN 'Advanced SQL Challenge Quiz'
WHEN m.module_title LIKE '%Machine Learning%' THEN 'ML Model Evaluation Quiz'
ELSE CONCAT(m.module_title, ' - Knowledge Quiz')
END,
'https://forms.google.com/',
20, 5, TRUE
FROM course_modules m;

-- REALISTIC ASSIGNMENTS / PROJECTS
INSERT INTO module_activities
(module_id, activity_type, activity_title, resource_link, points, due_in_days, is_mandatory)
SELECT
m.id,
CASE WHEN m.module_order = 3 THEN 'PROJECT' ELSE 'ASSIGNMENT' END,
CASE
WHEN m.module_title LIKE '%Spring Boot%' THEN 'Build Student Management REST API'
WHEN m.module_title LIKE '%React%' THEN 'Create Responsive LMS Dashboard'
WHEN m.module_title LIKE '%Data Analysis%' THEN 'Analyze Netflix Dataset using pandas'
WHEN m.module_title LIKE '%Machine Learning%' THEN 'Build Movie Recommendation System'
WHEN m.module_title LIKE '%Docker%' THEN 'Containerize Full Stack Application'
WHEN m.module_title LIKE '%Cloud%' THEN 'Deploy Application on AWS EC2'
WHEN m.module_title LIKE '%System Design%' THEN 'Design YouTube Architecture'
WHEN m.module_title LIKE '%Security%' THEN 'Perform OWASP Security Audit'
ELSE CONCAT(m.module_title, ' - Practice Assignment')
END,
'https://github.com/',
CASE WHEN m.module_order = 3 THEN 40 ELSE 25 END,
CASE WHEN m.module_order = 3 THEN 10 ELSE 7 END,
TRUE
FROM course_modules m;

-- ---------------------------------------------------------------
-- Module parts (4 parts per module = 120 parts)
-- ---------------------------------------------------------------
INSERT INTO module_parts (module_id, part_title, part_order, content_type, duration_minutes, resource_link)
SELECT m.id, CONCAT(m.module_title, ' - Introduction'), 1, 'INTRO', 10,
       CONCAT('https://learning.example.com/courses/', m.course_id, '/modules/', m.module_order, '/parts/intro')
FROM course_modules m;

INSERT INTO module_parts (module_id, part_title, part_order, content_type, duration_minutes, resource_link)
SELECT m.id, CONCAT(m.module_title, ' - Core Lesson'), 2, 'LESSON', 25,
       CONCAT('https://learning.example.com/courses/', m.course_id, '/modules/', m.module_order, '/parts/core-lesson')
FROM course_modules m;

INSERT INTO module_parts (module_id, part_title, part_order, content_type, duration_minutes, resource_link)
SELECT m.id, CONCAT(m.module_title, ' - Guided Demo'), 3, 'DEMO', 20,
       CONCAT('https://learning.example.com/courses/', m.course_id, '/modules/', m.module_order, '/parts/guided-demo')
FROM course_modules m;

INSERT INTO module_parts (module_id, part_title, part_order, content_type, duration_minutes, resource_link)
SELECT m.id, CONCAT(m.module_title, ' - Recap and Checklist'), 4, 'RECAP', 12,
       CONCAT('https://learning.example.com/courses/', m.course_id, '/modules/', m.module_order, '/parts/recap')
FROM course_modules m;

-- ---------------------------------------------------------------
-- Student activity progress seed (realistic mix)
-- ---------------------------------------------------------------
-- Completed entries for first enrolled course activity sets
INSERT INTO student_activity_progress (student_id, activity_id, status, score, submitted_at)
SELECT sc.student_id, a.id, 'COMPLETED',
       CASE WHEN a.activity_type = 'QUIZ' THEN FLOOR(70 + RAND() * 31) ELSE NULL END,
       DATE_ADD('2026-05-01 10:00:00', INTERVAL FLOOR(RAND() * 20) DAY)
FROM student_course sc
JOIN course_modules m ON m.course_id = sc.course_id
JOIN module_activities a ON a.module_id = m.id
WHERE m.module_order = 1;

-- In-progress entries for module 2
INSERT IGNORE INTO student_activity_progress (student_id, activity_id, status, score, submitted_at)
SELECT sc.student_id, a.id, 'IN_PROGRESS', NULL, NULL
FROM student_course sc
JOIN course_modules m ON m.course_id = sc.course_id
JOIN module_activities a ON a.module_id = m.id
WHERE m.module_order = 2 AND a.activity_type IN ('VIDEO', 'READING');

-- Not-started entries for module 3 project/assignment
INSERT IGNORE INTO student_activity_progress (student_id, activity_id, status, score, submitted_at)
SELECT sc.student_id, a.id, 'NOT_STARTED', NULL, NULL
FROM student_course sc
JOIN course_modules m ON m.course_id = sc.course_id
JOIN module_activities a ON a.module_id = m.id
WHERE m.module_order = 3;

INSERT INTO help_faqs (question, answer, sort_order) VALUES
('How do I enroll in a course?', 'Go to Browse Courses and click Enroll Now on any course to get instant access.', 1),
('How are grades calculated?', 'Grades use weighted quiz, assignment, and project scores captured from activity progress.', 2),
('Can I unenroll from a course?', 'Yes. Admin can remove enrollments and your remaining progress will be reset for that course.', 3),
('How do I get certificates?', 'Certificates are issued when course completion crosses eligibility threshold and score is passing.', 4),
('How can I contact support?', 'Use email support, live chat, or phone from the contact panel.', 5);

INSERT INTO support_contacts (icon, label, sub, action, color, sort_order) VALUES
('Mail', 'Email Support', 'support@edunexus.edu', 'Send Email', '#3b82f6', 1),
('MessageCircle', 'Live Chat', 'Available 9am-6pm IST', 'Start Chat', '#10b981', 2),
('Phone', 'Phone', '+91 1800-120-LEARN', 'Call Now', '#f59e0b', 3);

-- Quick check views
-- SELECT * FROM course_modules ORDER BY course_id, module_order;
-- SELECT * FROM module_activities ORDER BY module_id, id;
-- SELECT * FROM module_parts ORDER BY module_id, part_order;
-- SELECT * FROM student_activity_progress ORDER BY student_id, activity_id;
