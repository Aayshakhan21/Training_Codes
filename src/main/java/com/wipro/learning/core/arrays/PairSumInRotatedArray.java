package com.wipro.learning.core.arrays;

public class PairSumInRotatedArray {

	public static void main(String[] args) {

		int[] arr = { 11, 15, 6, 8, 9, 10 };
		int target = 16;
		int n = arr.length;

		// Find pivot (smallest element index)
		int pivot = 0;
		for (int i = 0; i < n - 1; i++) {
			if (arr[i] > arr[i + 1]) {
				pivot = i + 1;
				break;
			}
		}

		int left = pivot; // smallest
		int right = (pivot - 1 + n) % n; // largest

		while (left != right) {
			int sum = arr[left] + arr[right];

			if (sum == target) {
				System.out.println("Pair found: " + arr[left] + ", " + arr[right]);
				return;
			}

			if (sum < target)
				left = (left + 1) % n;
			else
				right = (right - 1 + n) % n;
		}

		System.out.println("No pair found");
	}
}