package com.company.dao;

import com.company.entity.Student;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StudentDao {

    @Autowired
    private SessionFactory sessionFactory;

    public void save(Student student) {

        Session session = sessionFactory.openSession();

        Transaction tx = session.beginTransaction();

        session.persist(student);

        tx.commit();

        session.close();
    }

    public List<Student> getAll() {

        Session session = sessionFactory.openSession();

        List<Student> students =
                session.createQuery("from Student", Student.class).list();

        session.close();

        return students;
    }

    public Student getById(Long id) {

        Session session = sessionFactory.openSession();

        Student student = session.get(Student.class, id);

        session.close();

        return student;
    }
}