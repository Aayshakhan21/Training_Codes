package com.wipro.learning.core.arrays;

public class LinearSearch {

	public static void main(String[] args) {
		// Search element in array (Linear Search)

		int[] arr = { 5, 15, 25, 35 };
		int target = 25;

		int result = search(arr, target);

		System.out.println(result != -1 ? "Found at index " + result : "Not found");

	}

	public static int search(int[] arr, int target) {
		for (int i = 0; i < arr.length; i++) {
			if (arr[i] == target) {
				return i;
			}
		}
		return -1;
	}

}
