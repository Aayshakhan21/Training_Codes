package com.wipro.dsa;

// Given a binary array nums, return the maximum number of consecutive 1s in the array.

public class MaxConsecutiveOnes {

	public static void main(String[] args) {

		int[] arr = { 1, 1, 0, 1, 1, 1 };

		int count = 0, max = 0;

		for (int num : arr) {
			if (num == 1) {
				count++;
				max = Math.max(max, count);
			} else {
				count = 0;
			}
		}

		System.out.println("Max Consecutive Ones: " + max);
	}
}