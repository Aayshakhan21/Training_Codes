package com.wipro.learning.controlflow;

import java.util.*;

public class MultiplicationTablePrinter {

	public static void main(String[] args) {
		// Print multiplication table (from 1 to 10)

		Scanner sc = new Scanner(System.in);
		int n = sc.nextInt();

		for (int i = 1; i <= n; i++) {
			System.out.println(n + " x " + i + " = " + (n * i));
		}
		
		sc.close();
	}

}
