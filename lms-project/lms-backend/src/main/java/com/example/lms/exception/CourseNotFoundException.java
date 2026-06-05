package com.example.lms.exception;

public class CourseNotFoundException
        extends RuntimeException {

    public CourseNotFoundException(String message) {

        super(message);
    }
}