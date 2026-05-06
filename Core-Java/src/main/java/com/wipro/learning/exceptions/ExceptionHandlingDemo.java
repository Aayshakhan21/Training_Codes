package com.wipro.learning.exceptions;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

@SuppressWarnings("serial")
class CustomException extends Exception {
	CustomException(String msg) {
		super(msg);
	}
}

public class ExceptionHandlingDemo {

	public static void main(String[] args) {

		// Try-Catch
		try {
//			int a = 10 / 0;
		} catch (ArithmeticException e) {
			System.out.println("Cannot divide by zero");
		}

		// Custom Exception
		try {
			checkAge(15);
		} catch (CustomException e) {
			System.out.println(e.getMessage());
		}

		// Try-with-resources
		try (BufferedReader br = new BufferedReader(new FileReader("test.txt"))) {
			System.out.println(br.readLine());
		} catch (IOException e) {
			System.out.println("File error");
		}
	}

	static void checkAge(int age) throws CustomException {
		if (age < 18) {
			throw new CustomException("Not eligible");
		}
	}
}