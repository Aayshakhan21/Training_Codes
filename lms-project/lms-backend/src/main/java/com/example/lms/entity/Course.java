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
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @NotBlank(message = "Course name cannot be empty")

    private String courseName;
    private String instructor;
    private String category;
    private String level;
    private String duration;
    private String imageUrl;
    private String publishedBy;
    private String badge;
    private Double rating;
    private Integer ratingCount;
    private Double priceInr;
    private Double listPriceInr;

    @Column(length = 2000)
    private String description;

    @ManyToMany(
            mappedBy = "courses",
            fetch = FetchType.EAGER
    )
    @JsonIgnoreProperties("courses")

    private List<Student> students =
            new ArrayList<>();
}
