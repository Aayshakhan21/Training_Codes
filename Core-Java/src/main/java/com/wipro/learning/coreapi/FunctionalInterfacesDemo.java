package com.wipro.learning.coreapi;

import java.util.function.*;
import java.util.*;

	class Students {
		String name;
		int marks;
	
		Students(String name, int marks) {
			this.name = name;
			this.marks = marks;
			
		}
	}

public class FunctionalInterfacesDemo {

	public static void main(String[] args) {

		List<Students> students = Arrays.asList(
			    new Students("Vishal", 45),
			    new Students("Jessica", 85),
			    new Students("Aman", 72),
			    new Students("Shubham", 30)
			);

		// Predicate → Takes input and returns a boolean. Filter (condition check).
		// I used Predicate to filter passed students
		Predicate<Students> isPassed = s -> s.marks >= 50;

		// Function → Takes input and returns a transformed output.
		// Function to convert marks into grades
		Function<Students, String> getGrade = s -> {
			if (s.marks >= 80)
				return "A";
			else if (s.marks >= 50)
				return "B";
			else
				return "FAIL";
		};

		// Consumer → Takes input and performs an action without returning anything.
		// Consumer to print student details
		Consumer<Students> printStudent = s -> {
			System.out.println("Name: " + s.name + ", Marks: " + s.marks);
		};

		// Supplier → Provides data without taking any input.
		// Supplier to generate a default student object
		Supplier<Students> defaultStudent = () -> new Students("Default", 60);

		System.out.println("---- Passed Students ----");

		for (Students s : students) {
			if (isPassed.test(s)) { // Predicate
				printStudent.accept(s); // Consumer
				System.out.println("Grade: " + getGrade.apply(s)); // Function
				System.out.println();
			}
		}

		System.out.println("---- Supplier Example ----");
		Students newStudent = defaultStudent.get();
		printStudent.accept(newStudent);
		System.out.println("Grade: " + getGrade.apply(newStudent));
	}
}