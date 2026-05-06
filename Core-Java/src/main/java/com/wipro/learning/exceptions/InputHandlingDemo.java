package com.wipro.learning.exceptions;

import java.util.InputMismatchException;
import java.util.Scanner;

public class InputHandlingDemo {
	public static void main(String[] args) {

		Scanner sc = new Scanner(System.in);

		try {
			System.out.print("Enter number: ");
			int num = sc.nextInt();
			System.out.println("You entered: " + num);
		} catch (InputMismatchException e) {
			System.out.println("Invalid input! Enter integer only.");
		} finally {
			sc.close();
		}
	}
}