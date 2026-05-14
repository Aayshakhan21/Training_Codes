package com.wipro.dsa;

// Given a sorted array, remove the duplicates so each element appears only once. Return the length of the modified array and modify the input array to contain unique elements in the first `k` positions, where `k` is the length of the unique elements.

public class RemoveDuplicatesSortedArray {

	public static void main(String[] args) {

		int[] arr = { 1, 1, 2, 3, 3, 4 };

		int index = 0;

		for (int i = 1; i < arr.length; i++) {
			if (arr[i] != arr[index]) {
				index++;
				arr[index] = arr[i];
			}
		}

		System.out.println("New Length: " + (index + 1));
	}
}