package com.company.service;

import com.company.dao.StudentDao;
import com.company.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentDao dao;

    public void create(Student student) {
        dao.save(student);
    }

    public List<Student> list() {
        return dao.getAll();
    }

    public Student get(Long id) {
        return dao.getById(id);
    }
}