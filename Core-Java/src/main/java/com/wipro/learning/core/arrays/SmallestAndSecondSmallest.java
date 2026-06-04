package com.wipro.learning.core.arrays;

public class SmallestAndSecondSmallest {

	public static void main(String[] args) {

		int[] arr = { 5, 2, 8, 1, 3 };

		int smallest = Integer.MAX_VALUE;
		int secondSmallest = Integer.MAX_VALUE;

		for (int num : arr) {
			if (num < smallest) {
				secondSmallest = smallest;
				smallest = num;
			} else if (num < secondSmallest && num != smallest) {
				secondSmallest = num;
			}
		}

		System.out.println("Smallest: " + smallest);
		System.out.println("Second Smallest: " + secondSmallest);
	}
}