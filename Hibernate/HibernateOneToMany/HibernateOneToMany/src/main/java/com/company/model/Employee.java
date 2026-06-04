package com.company.model;

import jakarta.persistence.*;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double salary;

    /*
        Many Employees belong to One Department
     */

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    public Employee() {

    }

    public Employee(
            String name,
            double salary
    ) {

        this.name = name;
        this.salary = salary;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getSalary() {
        return salary;
    }

    public void setDepartment(
            Department department
    ) {

        this.department = department;
    }

    public Department getDepartment() {
        return department;
    }

    @Override
    public String toString() {

        return "Employee [id=" + id +
                ", name=" + name +
                ", salary=" + salary + "]";
    }
}