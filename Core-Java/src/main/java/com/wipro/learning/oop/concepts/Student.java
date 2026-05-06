package com.wipro.learning.oop.concepts;

public class Student {
	/*
	 * 1.Problem Statement Design a system to manage student details. Requirements:
	 * Create a class Student Fields: name, rollNo, marks Use a constructor to
	 * initialize values Create methods: calculateGrade() → return grade
	 * (A/B/C/Fail) displayDetails() → print student info Create multiple student
	 * objects and display results
	 * 
	 */

	private String name;
	private int rollNo;
	private float marks;

	public Student(String name, int rollNo, float marks) {
		this.name = name;
		this.rollNo = rollNo;
		this.marks = marks;
	}

	public String calculateGrade() {
		if (marks >= 80) {
			return "A";
		} else if (marks <= 80 && marks >= 70) {
			return "B";
		} else if (marks <= 70 && marks >= 33) {
			return "C";
		} else {
			return "FAIL";
		}
	}

	public void displayDetails() {
		System.out.println(
				"Name: " + name + "\nRollNo: " + rollNo + "\nMarks: " + marks + "\nGrade: " + calculateGrade());
	}

	public static void main(String[] args) {
		Student student = new Student("Vishal", 1020, 95);
		student.displayDetails();
	}

}