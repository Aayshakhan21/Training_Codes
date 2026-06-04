package com.appverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * AppVerse AI – Main Application Entry Point
 */
@SpringBootApplication
@EnableScheduling
public class AppVerseApplication {
    public static void main(String[] args) {
        SpringApplication.run(AppVerseApplication.class, args);
        System.out.println("""
                ╔═══════════════════════════════════════╗
                ║   AppVerse AI Backend Started 🚀      ║
                ║   http://localhost:8080               ║
                ║   Swagger: /swagger-ui.html           ║
                ╚═══════════════════════════════════════╝
                """);
    }
}
