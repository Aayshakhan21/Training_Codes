package com.wipro.learning.core.arrays;

public class SeparateEvenOdd {

	public static void main(String[] args) {

		int[] arr = { 1, 2, 3, 4, 5, 6 };

		int left = 0;
		int right = arr.length - 1;

		while (left < right) {

			while (arr[left] % 2 == 0 && left < right) {
				left++;
			}

			while (arr[right] % 2 != 0 && left < right) {
				right--;
			}

			// swap
			int temp = arr[left];
			arr[left] = arr[right];
			arr[right] = temp;
		}

		for (int num : arr) {
			System.out.print(num + " ");
		}
	}
}