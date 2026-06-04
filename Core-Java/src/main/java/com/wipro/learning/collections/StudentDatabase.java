package com.wipro.learning.collections;

import java.util.HashMap;

		//             Student Database[HashMap]
		// Store student ID and name, and fetch name using ID

public class StudentDatabase {

	public static void main(String[] args) {

		// Key = student ID, Value = name
		HashMap<Integer, String> students = new HashMap<>();

		// Add entries
		students.put(101, "Vishal");
		students.put(102, "Aman");
		students.put(103, "Neha");

		int searchId = 101;

		// Fetch by ID
		if (students.containsKey(searchId)) {
			System.out.println("Student Name: " + students.get(searchId));
		} else {
			System.out.println("Student not found");
		}
	}
}