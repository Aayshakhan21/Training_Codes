package com.example.lms.service;

import com.example.lms.entity.Student;

import com.example.lms.exception.StudentNotFoundException;

import com.example.lms.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // ADD STUDENT

    public Student addStudent(Student student){

        return studentRepository.save(student);
    }

    // GET ALL STUDENTS

    public List<Student> getAllStudents(){

        return studentRepository.findAll();
    }

    // GET STUDENT BY ID

    public Student getStudentById(Long id){

        return studentRepository.findById(id)

                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student does not exist"
                        ));
    }

    // DELETE STUDENT

    public void deleteStudent(Long id){

        Student student =
                getStudentById(id);

        studentRepository.delete(student);
    }

    // UPDATE STUDENT

    public Student updateStudent(
            Long id,
            Student updatedStudent
    ){

        Student existingStudent =
                getStudentById(id);

        existingStudent.setStudentName(
                updatedStudent.getStudentName()
        );
        existingStudent.setEmail(
                updatedStudent.getEmail()
        );
        existingStudent.setGrade(
                updatedStudent.getGrade()
        );
        existingStudent.setJoinDate(
                updatedStudent.getJoinDate() == null
                        ? existingStudent.getJoinDate()
                        : updatedStudent.getJoinDate()
        );

        existingStudent.setCourses(
                updatedStudent.getCourses()
        );

        return studentRepository.save(
                existingStudent
        );
    }
}
