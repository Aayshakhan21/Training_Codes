package com.wipro.learning.core.arrays;

public class MaxElementInArray {

	public static void main(String[] args) {

		// Find maximum element

		int numbers[] = { 2, 4, 3, 6, 8, 1 };

		int max = Integer.MIN_VALUE;

		for (int i = 0; i < numbers.length; i++) {
			if (max < numbers[i]) {
				max = numbers[i];
			}
		}
		System.out.println("Max number is: " + max);
	}

}
