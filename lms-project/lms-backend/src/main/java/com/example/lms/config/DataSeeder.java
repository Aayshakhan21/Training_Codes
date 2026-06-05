package com.example.lms.config;

import com.example.lms.entity.AppUser;
import com.example.lms.entity.Student;
import com.example.lms.repository.AppUserRepository;
import com.example.lms.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedAdmin(AppUserRepository appUserRepository, StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!appUserRepository.existsByUsername("admin")) {
                AppUser admin = new AppUser();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setName("Administrator");
                admin.setRole("ADMIN");
                appUserRepository.save(admin);
            }

            for (Student student : studentRepository.findAll()) {
                String email = student.getEmail();
                if (email == null || email.isBlank()) {
                    continue;
                }
                if (!appUserRepository.existsByUsername(email)) {
                    AppUser learner = new AppUser();
                    learner.setUsername(email);
                    learner.setPassword(passwordEncoder.encode("password123"));
                    learner.setName(student.getStudentName());
                    learner.setRole("USER");
                    appUserRepository.save(learner);
                }
            }
        };
    }
}
