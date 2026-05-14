package com.company;

import com.company.model.Department;
import com.company.model.Employee;
import com.company.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class App {

    public static void main(String[] args) {

        Session session =
                HibernateUtil
                        .getSessionFactory()
                        .openSession();

        Transaction tx =
                session.beginTransaction();

        // Parent Object
        Department department =
                new Department("IT");

        // Child Objects
        Employee employee1 =
                new Employee(
                        "Vishal",
                        50000
                );

        Employee employee2 =
                new Employee(
                        "Rahul",
                        40000
                );

        Employee employee3 =
                new Employee(
                        "Aman",
                        35000
                );

        // Add Employees into Department
        department.addEmployee(employee1);

        department.addEmployee(employee2);

        department.addEmployee(employee3);

        // Save Parent
        // Employees save automatically
        session.persist(department);

        tx.commit();

        System.out.println(
                "\nDepartment Saved Successfully"
        );

        // Fetch Department
        Department fetchedDepartment =
                session.get(
                        Department.class,
                        1L
                );

        System.out.println(
                "\nDepartment Details"
        );

        System.out.println(
                fetchedDepartment
        );

        System.out.println(
                "\nEmployee Details"
        );

        for (Employee employee :
                fetchedDepartment.getEmployees()) {

            System.out.println(employee);
        }

        session.close();

        HibernateUtil.close();
    }
}