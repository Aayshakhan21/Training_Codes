package com.company;

import org.hibernate.Session;
import org.hibernate.Transaction;

import com.company.model.ReportCard;
import com.company.model.Student;
import com.company.util.HibernateUtil;

public class App {

    public static void main(String[] args) {

        // Open Session
        Session session = HibernateUtil.getSessionFactory().openSession();
        
        // Begin Transaction
        Transaction tx = session.beginTransaction();

        // Create Child Object
        ReportCard reportCard = new ReportCard(95.5);

        // Create Parent Object
        Student student = new Student("Vishal");

        // Set Child Object into Parent
        student.setReportcard(reportCard);

        // Save Parent Object
        // ReportCard will save automatically
        // because of CascadeType.ALL
        session.persist(student);

        // Commit Transaction
        tx.commit();

        // Fetch Student Details
        Student fetchedStudent = session.get(Student.class, 1L);
        System.out.println("\nStudent Details");
        System.out.println(fetchedStudent);

        // Close Session
        session.close();

        // Close SessionFactory
        HibernateUtil.close();
    }
}