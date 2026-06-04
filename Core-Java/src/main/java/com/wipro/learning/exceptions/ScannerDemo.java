package com.wipro.learning.exceptions;

import java.util.Scanner;

public class ScannerDemo {

	public static void main(String[] args) {

		try (Scanner scanner = new Scanner(System.in)) {
			System.out.println("Enter your name:");
			String name = scanner.nextLine();
			System.out.println("Hello, " + name);
		} catch (Exception e) {
			System.out.println("Error: " + e.getMessage());
		}
	}
}