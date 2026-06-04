package com.company.util;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import com.company.model.ReportCard;
import com.company.model.Student;

public class HibernateUtil {


    private static final SessionFactory sessionFactory = buildSessionFactory();


    private static SessionFactory buildSessionFactory()  {
        try {
            // Create the SessionFactory from hibernate.cfg.xml

            return new Configuration().configure("hibernate.cfg.xml")
                    .addAnnotatedClass(Student.class)
                    .addAnnotatedClass(ReportCard.class)
                    .buildSessionFactory();


        }
        catch (Exception ex) {
            // Make sure you log the exception, as it might be swallowed
            throw new RuntimeException("Initial SessionFactory creation failed." + ex);

        }
    }

    public static SessionFactory getSessionFactory()
    {
        return sessionFactory;
    }


    public static void   close()
    {
        sessionFactory.close();
    }
}