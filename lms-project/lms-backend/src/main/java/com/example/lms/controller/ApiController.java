package com.example.lms.controller;

import com.example.lms.entity.Course;
import com.example.lms.entity.Student;
import com.example.lms.service.CourseService;
import com.example.lms.service.StudentService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ApiController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private StudentService studentService;

    @GetMapping("/courses")
    public List<Course> getCourses() {
        return courseService.getAllCourses();
    }

    @PostMapping("/courses")
    public Course addCourse(@RequestBody Course course) {
        return courseService.addCourse(course);
    }

    @PutMapping("/courses/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course course) {
        return courseService.updateCourse(id, course);
    }

    @DeleteMapping("/courses/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }

    @GetMapping("/students")
    public List<Student> getStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping("/students")
    public Student addStudent(@RequestBody StudentPayload payload) {
        Student student = new Student();
        student.setStudentName(payload.getStudentName());
        student.setEmail(payload.getEmail());
        student.setGrade(payload.getGrade() == null ? "N/A" : payload.getGrade());
        student.setJoinDate(LocalDate.now().toString());
        student.setCourses(getCoursesByIds(payload.getCourseIds()));
        return studentService.addStudent(student);
    }

    @PutMapping("/students/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody StudentPayload payload) {
        Student student = new Student();
        student.setStudentName(payload.getStudentName());
        student.setEmail(payload.getEmail());
        student.setGrade(payload.getGrade() == null ? "N/A" : payload.getGrade());
        student.setJoinDate(payload.getJoinDate());
        student.setCourses(getCoursesByIds(payload.getCourseIds()));
        return studentService.updateStudent(id, student);
    }

    @DeleteMapping("/students/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }

    private List<Course> getCoursesByIds(List<Long> courseIds) {
        List<Course> courses = new ArrayList<>();
        if (courseIds == null) {
            return courses;
        }
        for (Long courseId : courseIds) {
            courses.add(courseService.getCourseById(courseId));
        }
        return courses;
    }

    @Data
    public static class StudentPayload {
        private String studentName;
        private String email;
        private String grade;
        private String joinDate;
        private List<Long> courseIds;
    }
}
