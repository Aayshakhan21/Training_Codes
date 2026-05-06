package com.wipro.dsa;

// Given an array nums, write a function to move all 0s to the end of it while maintaining the relative order of the non-zero elements.

public class MoveZeroes {

	public static void main(String[] args) {

		int[] arr = { 1, 1, 0, 3, 12 };

		int index = 0;

		for (int i = 0; i < arr.length; i++) {
			if (arr[i] != 0) {
				int temp = arr[i];
				arr[i] = arr[index];
				arr[index] = temp;
				index++;
			}
		}

		for (int num : arr)
			System.out.print(num + " ");
	}
}