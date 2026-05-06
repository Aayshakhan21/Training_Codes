package com.wipro.learning.collections;

import java.util.HashSet;
import java.util.Set;

public class StudentSetDemo {

	public static void main(String[] args) {

		Set<Student> students = new HashSet<>();

		students.add(new Student("Sakshi", 12));
		students.add(new Student("Ram", 22));
		students.add(new Student("Sakshi", 12)); // duplicate
		students.add(new Student("Sneha", 14));

		System.out.println("Unique Students:");

		for (Student s : students) {
			System.out.println(s.getName() + " - " + s.getRollno());
			System.out.println("----------------------");
		}
	}
}