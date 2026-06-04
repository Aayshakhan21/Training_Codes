package com.company.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    /*
        One Department can have many Employees
     */

    @OneToMany(
            mappedBy = "department",
            cascade = CascadeType.ALL
    )
    private List<Employee> employees =
            new ArrayList<>();

    public Department() {

    }

    public Department(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // helper method
    public void addEmployee(Employee employee) {

        employees.add(employee);

        employee.setDepartment(this);
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    @Override
    public String toString() {
        return "Department [id=" + id +
                ", name=" + name + "]";
    }
}