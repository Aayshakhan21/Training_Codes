package com.wipro.dsa;

// Find the missing number in an array containing ndistinct numbers from 0 to n.

public class MissingNumber {

	public static void main(String[] args) {

		int[] arr = { 3, 0, 1 };
		int n = arr.length;

		int total = n * (n + 1) / 2;
		int sum = 0;

		for (int num : arr)
			sum += num;

		System.out.println("Missing: " + (total - sum));
	}
}