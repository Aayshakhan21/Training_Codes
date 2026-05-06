package com.wipro.learning.controlflow;

import java.util.Scanner;

public class BasicCalculator {

	public static void main(String args[]) {
		Scanner sc = new Scanner(System.in);

		// Basic calculator code

		boolean choice = false;

		do {
			System.out.println("enter 2 numbers: ");
			int num1 = sc.nextInt();
			int num2 = sc.nextInt();

			System.out.println(" Welcome to Java Calculator ");
			System.out.println("1. Addition ");
			System.out.println("2. Sub ");
			System.out.println("3. Multiplication ");
			System.out.println("4. Division ");

			int operation = sc.nextInt();

			if (operation == 1)
				System.out.println(num1 + num2);
			else if (operation == 2)
				System.out.println(num1 - num2);
			else if (operation == 3)
				System.out.println(num1 * num2);
			else if (operation == 4)
				System.out.println(num1 / num2);
			else
				System.out.println("invalid choice");

			System.out.println("do you want to coontinue?(true/false)");
			choice = sc.nextBoolean();
		} while (choice);
		
		sc.close();

	}

}
