package com.wipro.learning.exceptions;

public class BasicTryCatchDemo {
	public static void main(String[] args) {
		try {
			int x = 10 / 0;
			System.out.println(x);
		} catch (ArithmeticException e) {
			System.out.println("Divide by zero not allowed");
		}
		System.out.println("Program continues...");
	}
}