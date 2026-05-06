package com.wipro.learning.oop.concepts;

public class Employee {
	
	/*
	 * 
	 * 3. Develop a system to calculate employee salary. Requirements: Class Employee
	 * Fields: name, basicSalary Constructor initializes values Methods:
	 * calculateHRA() → 20% of salary calculateDA() → 10% of salary
	 * calculateTotalSalary() Display full salary breakdown
	 * 
	 */

	String name;
	int id;
	private double basicSalary;

//	Employee(String name, double basicSalary) {
//		this.name = name;
//		this.basicSalary = basicSalary;
//	}

	double calculateHRA() {
		return basicSalary * 0.2;
	}

	double calculateDA() {
		return basicSalary * 0.1;
	}

	double calculateTotalSalary() {
		return basicSalary + calculateHRA() + calculateDA();
	}

	void display() {
		System.out.println(name);
		System.out.println("Basic: " + basicSalary);
		System.out.println("HRA: " + calculateHRA());
		System.out.println("DA: " + calculateDA());
		System.out.println("Total: " + calculateTotalSalary());
	}

//	public static void main(String[] args) {
//		Employee e = new Employee("Ajit", 10000);
//		e.display();
//	}

	void displayDetails() {
		System.out.println("ID: " + id + " | Name: " + name);
	}
}