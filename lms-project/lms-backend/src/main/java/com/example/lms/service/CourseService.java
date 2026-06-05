package com.example.lms.service;

import com.example.lms.entity.Course;

import com.example.lms.exception.CourseNotFoundException;

import com.example.lms.repository.CourseRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // ADD COURSE

    public Course addCourse(Course course){

        return courseRepository.save(course);
    }

    // GET ALL COURSES

    public List<Course> getAllCourses(){

        return courseRepository.findAll();
    }

    // GET COURSE BY ID

    public Course getCourseById(Long id){

        return courseRepository.findById(id)

                .orElseThrow(() ->
                        new CourseNotFoundException(
                                "Course does not exist"
                        ));
    }

    // DELETE COURSE

    public void deleteCourse(Long id){

        Course course = getCourseById(id);

        courseRepository.delete(course);
    }

    // UPDATE COURSE

    public Course updateCourse(
            Long id,
            Course updatedCourse
    ){

        Course existingCourse =
                getCourseById(id);

        existingCourse.setCourseName(
                updatedCourse.getCourseName()
        );
        existingCourse.setInstructor(
                updatedCourse.getInstructor()
        );
        existingCourse.setCategory(
                updatedCourse.getCategory()
        );
        existingCourse.setLevel(
                updatedCourse.getLevel()
        );
        existingCourse.setDuration(
                updatedCourse.getDuration()
        );
        existingCourse.setImageUrl(
                updatedCourse.getImageUrl()
        );
        existingCourse.setPublishedBy(
                updatedCourse.getPublishedBy()
        );
        existingCourse.setBadge(
                updatedCourse.getBadge()
        );
        existingCourse.setRating(
                updatedCourse.getRating()
        );
        existingCourse.setRatingCount(
                updatedCourse.getRatingCount()
        );
        existingCourse.setPriceInr(
                updatedCourse.getPriceInr()
        );
        existingCourse.setListPriceInr(
                updatedCourse.getListPriceInr()
        );
        existingCourse.setDescription(
                updatedCourse.getDescription()
        );

        return courseRepository.save(
                existingCourse
        );
    }
}
