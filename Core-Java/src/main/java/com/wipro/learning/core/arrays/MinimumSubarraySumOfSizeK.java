package com.wipro.learning.core.arrays;

public class MinimumSubarraySumOfSizeK {

	public static void main(String[] args) {

		int[] nums = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
		int k = 4;

		int windowSum = 0;

		// First window
		for (int i = 0; i < k; i++) {
			windowSum += nums[i];
		}

		int minSum = windowSum;
		int start = 0;

		// Sliding window
		for (int i = k; i < nums.length; i++) {
			windowSum += nums[i] - nums[i - k];

			if (windowSum < minSum) {
				minSum = windowSum;
				start = i - k + 1;
			}
		}

		System.out.println("Sub-array size: " + k);
		System.out.println("Start index: " + start);
		System.out.println("End index: " + (start + k - 1));
		System.out.println("Min Sum: " + minSum);
	}
}