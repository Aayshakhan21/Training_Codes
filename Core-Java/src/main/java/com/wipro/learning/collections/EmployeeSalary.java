package com.wipro.learning.collections;

import java.util.ArrayList;

		//             Employee Salary List[ArrayList]
		// 		Store salaries and increase all salaries by 10%.

public class EmployeeSalary {

	public static void main(String[] args) {

		ArrayList<Double> salaries = new ArrayList<>();

		salaries.add(20000.0);
		salaries.add(30000.0);
		salaries.add(25000.0);

		// Increase salary by 10%
		for (int i = 0; i < salaries.size(); i++) {
			double updated = salaries.get(i) * 1.10;
			salaries.set(i, updated);
		}

		System.out.println("Updated Salaries:");
		for (double s : salaries) {
			System.out.println(s);
		}
	}
}