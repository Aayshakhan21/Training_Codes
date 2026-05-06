package com.wipro.learning.collections;

import java.util.HashMap;

//                 Employee Salary Lookup[HashMap]
//    Store employee ID and salary, and retrieve salary by ID.

public class EmployeeSalaryLookup {

	public static void main(String[] args) {

		// Key = employee ID, Value = salary
		HashMap<Integer, Double> salaryMap = new HashMap<>();

		salaryMap.put(1, 25000.0);
		salaryMap.put(2, 21235.0);
		salaryMap.put(3, 28000.0);

		int empId = 2;

		// Retrieve salary
		Double salary = salaryMap.get(empId);

		if (salary != null) {
			System.out.println("Salary: " + salary);
		} else {
			System.out.println("Employee not found");
		}
	}
}