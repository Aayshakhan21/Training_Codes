package com.wipro.learning.controlflow;

import java.util.*;

public class FactorialUsingLoop {

	public static void main(String[] args) {

		// Factorial using loop

		Scanner sc = new Scanner(System.in);
		int n = sc.nextInt();

		int result = 1;

		for (int i = 0; i <= n; i++) {
			result = result * i;
		}

		System.out.println("Factorial: " + result);
		
		sc.close();

	}

}
