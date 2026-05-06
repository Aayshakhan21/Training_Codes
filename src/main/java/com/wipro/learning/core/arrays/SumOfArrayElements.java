package com.wipro.learning.core.arrays;

public class SumOfArrayElements {

	// Sum of array elements

	public static void main(String[] args) {

		int[] arr = { 2, 3, 5, 1, 4, 6, 8, 5, 9 };
		int sum = 0;

		for (int i = 0; i < arr.length; i++) {
			sum += arr[i];
		}

		System.out.println("Sum of array elements: " + sum);
	}

}
