package com.wipro.learning.oop.advanced;

abstract class Employee {
    String name;
    double salary;

    Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    abstract double calculateBonus();

    void display() {
        System.out.println("Name: " + name);
        System.out.println("Salary: " + salary);
        System.out.println("Bonus: " + calculateBonus());
    }
}

class Manager extends Employee {

    Manager(String name, double salary) {
        super(name, salary);
    }

    double calculateBonus() {
        return salary * 0.20;
    }
}

class Developer extends Employee {

    Developer(String name, double salary) {
        super(name, salary);
    }

    double calculateBonus() {
        return salary * 0.10;
    }
}

public class EmployeeSystemDemo {
    public static void main(String[] args) {
        Employee m = new Manager("Vishal", 50000);
        Employee d = new Developer("Rahul", 40000);

        m.display();
        System.out.println("-----");
        d.display();
    }
}