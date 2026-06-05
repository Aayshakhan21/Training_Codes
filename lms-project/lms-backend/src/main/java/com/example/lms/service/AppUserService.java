package com.example.lms.service;

import com.example.lms.entity.AppUser;
import com.example.lms.entity.Student;
import com.example.lms.repository.AppUserRepository;
import com.example.lms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class AppUserService {

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private StudentRepository studentRepository;

    public AppUser register(String username, String password, String name) {
        if (appUserRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }

        AppUser user = new AppUser();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        user.setRole("USER");
        AppUser savedUser = appUserRepository.save(user);

        if (!studentRepository.existsByEmail(username)) {
            Student student = new Student();
            student.setStudentName(name);
            student.setEmail(username);
            student.setGrade("N/A");
            student.setJoinDate(LocalDate.now().format(DateTimeFormatter.ISO_DATE));
            studentRepository.save(student);
        }

        return savedUser;
    }

    public AppUser login(String username, String password) {
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return user;
    }
}
