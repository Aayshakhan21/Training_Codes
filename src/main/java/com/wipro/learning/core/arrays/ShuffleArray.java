package com.wipro.learning.core.arrays;

import java.util.Random;

public class ShuffleArray {

	public static void main(String[] args) {

		int[] arr = { 1, 2, 3, 4, 5, 6 };

		Random rand = new Random();

		// Fisher-Yates Shuffle
		for (int i = arr.length - 1; i > 0; i--) {
			int j = rand.nextInt(i + 1);

			int temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}

		System.out.print("Shuffled Array: ");
		for (int num : arr) {
			System.out.print(num + " ");
		}
	}
}