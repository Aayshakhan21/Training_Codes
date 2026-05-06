package com.wipro.learning.controlflow;

import java.util.*;

public class LargestOfThreeNumbers {

	public static void main(String[] args) {
		// Largest of 3 numbers
		Scanner sc = new Scanner(System.in);

		int a = sc.nextInt();
		int b = sc.nextInt();
		int c = sc.nextInt();

		if (a > b && a > c) {
			System.out.println("A is a Larger Number: " + a);
		} else if (b > c && b > a) {
			System.out.println("B is a Larger Number: " + b);
		} else {
			System.out.println("C is a Larger Number: " + c);
		}
		
		sc.close();

	}

}
