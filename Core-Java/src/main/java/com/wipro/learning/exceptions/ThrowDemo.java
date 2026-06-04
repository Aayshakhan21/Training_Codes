package com.wipro.learning.exceptions;

public class ThrowDemo {

	static void checkAge(int age) {
		if (age < 18) {
			throw new IllegalArgumentException("Not eligible");
		}
		System.out.println("Eligible");
	}

	public static void main(String[] args) {
		checkAge(15);
	}
}