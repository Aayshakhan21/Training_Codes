package com.wipro.learning.controlflow;

import java.util.*;

public class SumOfFirstNNumbers {

	// Sum of first N numbers

	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);

		int n = sc.nextInt();
		int sum = 0;

		for (int i = 0; i <= n; i++) {
			sum += i;
		}
		System.out.println("The sum of numbers is: " + sum);
		
		sc.close();
	}
	

}
