package com.wipro.dsa;

// Given an integer array nums, find the contiguous subarray (containing at least one number) that has the largest sum and return its sum.

public class MaximumSubarray {

	public static void main(String[] args) {

		int[] arr = { -2, 1, -3, 4, -1, 2, 1, -5, 4 };

		int max = arr[0];
		int sum = arr[0];

		for (int i = 1; i < arr.length; i++) {
			sum = Math.max(arr[i], sum + arr[i]);
			max = Math.max(max, sum);
		}

		System.out.println("Max Sum: " + max);
	}
}