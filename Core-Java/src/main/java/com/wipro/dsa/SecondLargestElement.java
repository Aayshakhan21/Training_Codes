package com.wipro.dsa;

// Write a Java program to find the second largest element in an array. You should solve this problem without sorting the array. If there are duplicate elements, they should be treated as individual values.

public class SecondLargestElement {

	public static void main(String[] args) {

		int[] arr = { 5, 7, 8, 8, 6, 4, 7 };

		int first = Integer.MIN_VALUE;
		int second = Integer.MIN_VALUE;

		for (int num : arr) {
			if (num > first) {
				second = first;
				first = num;
			} else if (num > second && num != first) {
				second = num;
			}
		}

		System.out.println("Second Largest: " + second);
	}
}