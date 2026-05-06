package com.wipro.learning.core.arrays;

public class MaximumSubarraySum {

	public static void main(String[] args) {

		int[] arr = { 1, 2, -3, -4, 0, 6, 7, 8, 9 };

		int maxSoFar = arr[0];
		int currentSum = arr[0];

		int start = 0, end = 0, tempStart = 0;

		for (int i = 1; i < arr.length; i++) {

			if (currentSum + arr[i] < arr[i]) {
				currentSum = arr[i];
				tempStart = i;
			} else {
				currentSum += arr[i];
			}

			if (currentSum > maxSoFar) {
				maxSoFar = currentSum;
				start = tempStart;
				end = i;
			}
		}

		System.out.println("Max Sum: " + maxSoFar);
		System.out.println("Subarray: [" + start + ", " + end + "]");
	}
}