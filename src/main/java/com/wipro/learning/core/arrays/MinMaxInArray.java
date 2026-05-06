package com.wipro.learning.core.arrays;

import java.util.*;

public class MinMaxInArray {

	public static void main(String[] args) {

		Scanner sc = new Scanner(System.in);

		// enter the size of array you want to input

		System.out.println("enter the size of array elements ");
		int size = sc.nextInt();
		int numbers[] = new int[size];

		// enter the array elements

		System.out.println("enter the array elements ");
		for (int i = 0; i < numbers.length; i++)
			numbers[i] = sc.nextInt();

		// find the minimum number in the array

		int min = Integer.MAX_VALUE;
		for (int i = 0; i < numbers.length; i++) {
			if (min > numbers[i]) {
				min = numbers[i];
			}

		}
		System.out.println("the min number is: " + min);

		// find the maximum number in the array

		int max = Integer.MIN_VALUE;
		for (int i = 0; i < numbers.length; i++) {
			if (max < numbers[i]) {
				max = numbers[i];
			}

		}
		System.out.println("the max number is: " + max);

		sc.close();
	}

}
