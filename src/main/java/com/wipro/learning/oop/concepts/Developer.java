package com.wipro.learning.oop.concepts;

public class Developer extends Employee {
	String technology = "Java";

	void showRole() {
		System.out.println(name + " is working on " + technology);
	}
}