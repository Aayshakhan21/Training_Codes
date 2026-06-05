package com.example.lms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/learning")
@CrossOrigin(origins = "http://localhost:5173")
public class LearningController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private Long resolveStudentId(String username) {
        if (username == null || username.isBlank()) {
            return null;
        }
        List<Long> ids = jdbcTemplate.queryForList(
                "SELECT id FROM students WHERE email = ? ORDER BY id LIMIT 1",
                Long.class,
                username
        );
        if (!ids.isEmpty()) {
            return ids.get(0);
        }

        List<Long> seededUserIds = jdbcTemplate.queryForList(
                """
                        SELECT s.id
                        FROM students s
                        JOIN app_users u ON u.name = s.student_name
                        WHERE u.username = ?
                        ORDER BY s.id LIMIT 1
                        """,
                Long.class,
                username
        );
        return seededUserIds.isEmpty() ? null : seededUserIds.get(0);
    }

    @GetMapping("/catalog")
    public Map<String, Object> getCatalog(@RequestParam(required = false) String username) {
        Long studentId = resolveStudentId(username);
        String sql = """
                SELECT c.id, c.course_name, c.instructor, c.category, c.level, c.duration,
                       c.image_url, c.published_by, c.badge, c.rating, c.rating_count, c.price_inr, c.list_price_inr,
                       COUNT(DISTINCT sc.student_id) AS enrolled,
                       MAX(CASE WHEN sc.student_id = ? THEN 1 ELSE 0 END) AS is_enrolled
                FROM courses c
                LEFT JOIN student_course sc ON sc.course_id = c.id
                GROUP BY c.id
                ORDER BY c.id
                """;
        List<Map<String, Object>> courses = jdbcTemplate.queryForList(sql, studentId == null ? -1L : studentId);
        Set<String> categories = new TreeSet<>();
        for (Map<String, Object> course : courses) {
            Object category = course.get("category");
            if (category != null) categories.add(category.toString());
        }
        return Map.of("courses", courses, "categories", categories);
    }

    @PostMapping("/enroll")
    public Map<String, Object> enroll(@RequestBody EnrollmentRequest request) {
        Long studentId = resolveStudentId(request.getUsername());
        if (studentId == null) {
            return Map.of("success", false, "message", "Student profile not found for user");
        }
        Integer exists = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM student_course WHERE student_id = ? AND course_id = ?
                """, Integer.class, studentId, request.getCourseId());
        if (exists == null || exists == 0) {
            jdbcTemplate.update("""
                    INSERT INTO student_course (student_id, course_id) VALUES (?, ?)
                    """, studentId, request.getCourseId());
        }
        return Map.of("success", true);
    }

    @PostMapping("/unenroll")
    public Map<String, Object> unenroll(@RequestBody EnrollmentRequest request) {
        Long studentId = resolveStudentId(request.getUsername());
        if (studentId == null) {
            return Map.of("success", false, "message", "Student profile not found for user");
        }
        jdbcTemplate.update("""
                DELETE FROM student_course WHERE student_id = ? AND course_id = ?
                """, studentId, request.getCourseId());
        return Map.of("success", true);
    }

    @GetMapping("/courses-progress")
    public List<Map<String, Object>> getCoursesWithProgress(@RequestParam(required = false) String username) {
        Long studentId = resolveStudentId(username);
        if (studentId == null) {
            return new ArrayList<>();
        }

        String sql = """
                SELECT c.id, c.course_name, c.instructor, c.category, c.level, c.duration,
                       c.image_url, c.published_by, c.badge, c.rating, c.rating_count, c.price_inr, c.list_price_inr,
                       COUNT(DISTINCT cm.id) AS modules_count,
                       COUNT(DISTINCT ma.id) AS activities_count,
                       SUM(CASE WHEN sap.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_activities
                FROM courses c
                JOIN student_course sc ON sc.course_id = c.id AND sc.student_id = ?
                LEFT JOIN course_modules cm ON cm.course_id = c.id
                LEFT JOIN module_activities ma ON ma.module_id = cm.id
                LEFT JOIN student_activity_progress sap ON sap.activity_id = ma.id AND sap.student_id = ?
                GROUP BY c.id
                ORDER BY c.id
                """;

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, studentId, studentId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> row : rows) {
            int activities = ((Number) row.get("activities_count")).intValue();
            int completed = ((Number) row.get("completed_activities")).intValue();
            int progress = activities > 0 ? (int) Math.round((completed * 100.0) / activities) : 0;
            String status = progress >= 100 ? "completed" : progress > 0 ? "in-progress" : "not-started";

            Map<String, Object> course = new HashMap<>(row);
            course.put("progress", Math.min(progress, 100));
            course.put("status", status);
            result.add(course);
        }
        return result;
    }

    @GetMapping("/courses/{courseId}/modules")
    public List<Map<String, Object>> getCourseModules(@PathVariable Long courseId) {
        String moduleSql = """
                SELECT id, module_title, module_order, estimated_hours, learning_outcomes
                FROM course_modules
                WHERE course_id = ?
                ORDER BY module_order
                """;

        List<Map<String, Object>> modules = jdbcTemplate.queryForList(moduleSql, courseId);
        for (Map<String, Object> module : modules) {
            Long moduleId = ((Number) module.get("id")).longValue();

            List<Map<String, Object>> parts = jdbcTemplate.queryForList("""
                    SELECT id, part_title, part_order, content_type, duration_minutes, resource_link
                    FROM module_parts
                    WHERE module_id = ?
                    ORDER BY part_order
                    """, moduleId);

            List<Map<String, Object>> activities = jdbcTemplate.queryForList("""
                    SELECT id, activity_type, activity_title, resource_link, points, due_in_days, is_mandatory
                    FROM module_activities
                    WHERE module_id = ?
                    ORDER BY id
                    """, moduleId);

            module.put("parts", parts);
            module.put("activities", activities);
        }
        return modules;
    }

    @GetMapping("/user/grades")
    public Map<String, Object> getUserGrades(@RequestParam(required = false) String username) {
        Long studentId = resolveStudentId(username);
        if (studentId == null) {
            return Map.of("grades", new ArrayList<>(), "avgScore", 0.0, "gpa", 0.0);
        }

        String sql = """
                SELECT c.id, c.course_name AS course,
                       ROUND(COALESCE(AVG(sap.score), 0), 0) AS score,
                       SUM(CASE WHEN ma.activity_type IN ('ASSIGNMENT','PROJECT','QUIZ') THEN 1 ELSE 0 END) AS assignments,
                       SUM(CASE WHEN ma.activity_type IN ('ASSIGNMENT','PROJECT','QUIZ') AND sap.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed
                FROM courses c
                JOIN student_course sc ON sc.course_id = c.id AND sc.student_id = ?
                LEFT JOIN course_modules cm ON cm.course_id = c.id
                LEFT JOIN module_activities ma ON ma.module_id = cm.id
                LEFT JOIN student_activity_progress sap ON sap.activity_id = ma.id AND sap.student_id = ?
                GROUP BY c.id
                HAVING assignments > 0
                ORDER BY c.id
                """;

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, studentId, studentId);
        List<Map<String, Object>> grades = new ArrayList<>();
        double totalScore = 0;
        for (Map<String, Object> row : rows) {
            int score = ((Number) row.get("score")).intValue();
            String grade = score >= 90 ? "A+" : score >= 85 ? "A" : score >= 80 ? "A-" : score >= 75 ? "B+" : "B";
            Map<String, Object> item = new HashMap<>(row);
            item.put("grade", grade);
            grades.add(item);
            totalScore += score;
        }

        double avg = grades.isEmpty() ? 0 : totalScore / grades.size();
        double gpa = Math.min(4.0, Math.round((avg / 25.0) * 100.0) / 100.0);

        return Map.of(
                "grades", grades,
                "avgScore", Math.round(avg * 10.0) / 10.0,
                "gpa", gpa
        );
    }

    @GetMapping("/user/certificates")
    public Map<String, Object> getUserCertificates(@RequestParam(required = false) String username) {
        Long studentId = resolveStudentId(username);
        if (studentId == null) {
            return Map.of("certificates", new ArrayList<>(), "inProgress", new ArrayList<>());
        }

        String sql = """
                SELECT c.id, c.course_name AS course, c.instructor,
                       COUNT(ma.id) AS total_activities,
                       SUM(CASE WHEN sap.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_activities,
                       ROUND(COALESCE(AVG(sap.score), 85), 0) AS score
                FROM courses c
                JOIN student_course sc ON sc.course_id = c.id AND sc.student_id = ?
                LEFT JOIN course_modules cm ON cm.course_id = c.id
                LEFT JOIN module_activities ma ON ma.module_id = cm.id
                LEFT JOIN student_activity_progress sap ON sap.activity_id = ma.id AND sap.student_id = ?
                GROUP BY c.id
                ORDER BY c.id
                """;

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, studentId, studentId);
        List<Map<String, Object>> certificates = new ArrayList<>();
        List<Map<String, Object>> inProgress = new ArrayList<>();
        int idx = 1;

        for (Map<String, Object> row : rows) {
            int total = ((Number) row.get("total_activities")).intValue();
            int completed = ((Number) row.get("completed_activities")).intValue();
            int progress = total > 0 ? (int) Math.round((completed * 100.0) / total) : 0;
            int score = ((Number) row.get("score")).intValue();

            if (progress >= 70) {
                Map<String, Object> cert = new HashMap<>();
                cert.put("id", row.get("id"));
                cert.put("course", row.get("course"));
                cert.put("date", "2026-05-" + String.format("%02d", Math.min(28, 10 + idx)));
                cert.put("grade", score >= 90 ? "A+" : score >= 85 ? "A" : "B+");
                cert.put("instructor", row.get("instructor"));
                cert.put("credential", "CERT-LMS-2026-" + String.format("%03d", idx));
                cert.put("score", score);
                certificates.add(cert);
                idx++;
            } else {
                inProgress.add(Map.of(
                        "course", row.get("course"),
                        "progress", Math.max(progress, 10)
                ));
            }
        }

        return Map.of(
                "certificates", certificates,
                "inProgress", inProgress
        );
    }

    @GetMapping("/help")
    public Map<String, Object> getHelp() {
        List<Map<String, Object>> faqs = jdbcTemplate.queryForList("""
                SELECT question AS q, answer AS a
                FROM help_faqs
                ORDER BY sort_order, id
                """);
        List<Map<String, Object>> contacts = jdbcTemplate.queryForList("""
                SELECT label, sub, color, action, icon
                FROM support_contacts
                ORDER BY sort_order, id
                """);
        return Map.of("faqs", faqs, "contacts", contacts);
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {
        List<Map<String, Object>> monthlyActivity = jdbcTemplate.queryForList("""
                SELECT DATE_FORMAT(s.join_date, '%b') AS month,
                       COUNT(DISTINCT s.id) AS enrollments
                FROM students s
                GROUP BY DATE_FORMAT(s.join_date, '%Y-%m'), DATE_FORMAT(s.join_date, '%b')
                ORDER BY DATE_FORMAT(s.join_date, '%Y-%m')
                """);

        Map<String, Integer> completionsByMonth = new HashMap<>();
        jdbcTemplate.queryForList("""
                SELECT DATE_FORMAT(submitted_at, '%b') AS month, COUNT(*) AS completions
                FROM student_activity_progress
                WHERE status = 'COMPLETED' AND submitted_at IS NOT NULL
                GROUP BY DATE_FORMAT(submitted_at, '%Y-%m'), DATE_FORMAT(submitted_at, '%b')
                """).forEach(row -> completionsByMonth.put(row.get("month").toString(), ((Number) row.get("completions")).intValue()));

        List<Map<String, Object>> monthly = new ArrayList<>();
        for (Map<String, Object> row : monthlyActivity) {
            String month = row.get("month").toString();
            int enrollments = ((Number) row.get("enrollments")).intValue();
            int completions = completionsByMonth.getOrDefault(month, Math.max(1, (int) Math.round(enrollments * 0.6)));
            int dropouts = Math.max(0, enrollments - completions - 1);
            monthly.add(Map.of("month", month, "enrollments", enrollments, "completions", completions, "dropouts", dropouts));
        }

        List<Map<String, Object>> radar = jdbcTemplate.queryForList("""
                SELECT LEFT(c.category, 12) AS subject,
                       ROUND(AVG(CASE WHEN sap.status = 'COMPLETED' THEN 90 ELSE 55 END), 0) AS value
                FROM courses c
                LEFT JOIN course_modules cm ON cm.course_id = c.id
                LEFT JOIN module_activities ma ON ma.module_id = cm.id
                LEFT JOIN student_activity_progress sap ON sap.activity_id = ma.id
                GROUP BY c.category
                ORDER BY c.category
                """);

        return Map.of(
                "monthlyActivity", monthly,
                "radar", radar
        );
    }

    @GetMapping("/notifications")
    public List<Map<String, Object>> getNotifications(@RequestParam(required = false) String username) {
        Long studentId = resolveStudentId(username);
        List<Map<String, Object>> notifications = new ArrayList<>();

        if (studentId != null) {
            Map<String, Object> me = jdbcTemplate.queryForList("""
                    SELECT student_name, join_date
                    FROM students
                    WHERE id = ?
                    """, studentId).stream().findFirst().orElse(null);
            if (me != null) {
                notifications.add(Map.of(
                        "id", 1,
                        "text", "Welcome, " + me.get("student_name") + ". Keep learning.",
                        "time", "recent",
                        "unread", true
                ));
            }
        }

        Map<String, Object> topCourse = studentId == null ? null : jdbcTemplate.queryForList("""
                SELECT c.course_name, COUNT(ma.id) AS total_activities
                FROM courses c
                JOIN student_course sc ON sc.course_id = c.id AND sc.student_id = ?
                LEFT JOIN course_modules cm ON cm.course_id = c.id
                LEFT JOIN module_activities ma ON ma.module_id = cm.id
                GROUP BY c.id
                ORDER BY total_activities DESC
                LIMIT 1
                """, studentId).stream().findFirst().orElse(null);
        if (topCourse != null) {
            notifications.add(Map.of(
                    "id", 2,
                    "text", "Focus course: " + topCourse.get("course_name"),
                    "time", "today",
                    "unread", true
            ));
        }

        Integer completed = studentId == null ? 0 : jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM student_activity_progress
                WHERE status = 'COMPLETED' AND student_id = ?
                """, Integer.class, studentId);
        notifications.add(Map.of(
                "id", 3,
                "text", "Your completed activities: " + (completed == null ? 0 : completed),
                "time", "this week",
                "unread", false
        ));

        return notifications;
    }

    public static class EnrollmentRequest {
        private String username;
        private Long courseId;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public Long getCourseId() {
            return courseId;
        }

        public void setCourseId(Long courseId) {
            this.courseId = courseId;
        }
    }
}
