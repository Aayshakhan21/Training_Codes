package com.example.lms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @NotBlank(message = "Student name cannot be empty")

    private String studentName;
    private String email;
    private String grade;
    private String joinDate;

    @ManyToMany(fetch = FetchType.EAGER)

    @JoinTable(
            name = "student_course",

            joinColumns =
            @JoinColumn(name = "student_id"),

            inverseJoinColumns =
            @JoinColumn(name = "course_id")
    )
    @JsonIgnoreProperties("students")

    private List<Course> courses =
            new ArrayList<>();
}
