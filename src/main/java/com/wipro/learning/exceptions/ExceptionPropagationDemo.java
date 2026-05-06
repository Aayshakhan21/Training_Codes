package com.wipro.learning.exceptions;

public class ExceptionPropagationDemo {

	static void method3() {
		int x = 10 / 0;
	}

	static void method2() {
		method3();
	}

	static void method1() {
		try {
			method2();
		} catch (ArithmeticException e) {
			System.out.println("Handled in method1");
		}
	}

	public static void main(String[] args) {
		method1();
	}
}