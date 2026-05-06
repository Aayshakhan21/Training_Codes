package com.wipro.learning.core.arrays;

public class RotationCountInArray {

	public static void main(String[] args) {

		int[] arr = { 15, 18, 2, 3, 6, 12 };

		int minIndex = 0;

		for (int i = 1; i < arr.length; i++) {
			if (arr[i] < arr[minIndex]) {
				minIndex = i;
			}
		}

		System.out.println("Rotation count: " + minIndex);
	}
}