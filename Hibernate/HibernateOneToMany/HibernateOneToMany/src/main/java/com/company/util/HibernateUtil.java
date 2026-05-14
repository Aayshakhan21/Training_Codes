package com.company.util;

import com.company.model.Department;
import com.company.model.Employee;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {

    private static final SessionFactory sessionFactory =
            buildSessionFactory();

    private static SessionFactory buildSessionFactory() {

        try {

            return new Configuration()
                    .configure("hibernate.cfg.xml")
                    .addAnnotatedClass(Department.class)
                    .addAnnotatedClass(Employee.class)
                    .buildSessionFactory();

        } catch (Exception e) {

            throw new RuntimeException(
                    "SessionFactory creation failed " + e
            );
        }
    }

    public static SessionFactory getSessionFactory() {

        return sessionFactory;
    }

    public static void close() {

        sessionFactory.close();
    }
}