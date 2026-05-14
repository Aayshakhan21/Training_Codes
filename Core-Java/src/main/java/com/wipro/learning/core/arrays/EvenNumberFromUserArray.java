package com.wipro.learning.core.arrays;

import java.util.Scanner;

public class EvenNumberFromUserArray {

	public static void main(String[] args) {

		Scanner s = new Scanner(System.in);
		System.out.println("enter the  size of array ");
		int size = s.nextInt();
		int numbers[] = new int[size];

		System.out.println("enter the array elements ");
		for (int i = 0; i < numbers.length; i++)
			numbers[i] = s.nextInt();

		for (int i = 0; i < numbers.length; i++) {
			if (numbers[i] % 2 == 0)
				System.out.println(numbers[i] + " is even");

		}

		s.close();
	}

}
