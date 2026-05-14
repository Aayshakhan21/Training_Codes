package com.wipro.learning.core.arrays;

public class CountEvenNumbersInArray {

	// Count even numbers in array

	public static void main(String[] args) {

		int[] arr = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
		int count = 0;

		for (int i = 0; i < arr.length; i++) {
			if (arr[i] % 2 == 0) {
				count++;
			}
		}
		System.out.println(count);
	}

}
