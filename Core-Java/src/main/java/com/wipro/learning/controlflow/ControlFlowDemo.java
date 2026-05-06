package com.wipro.learning.controlflow;

import java.util.Arrays;

public class ControlFlowDemo {

	public static void main(String[] args) {

		// For loop
		for (int i = 1; i <= 5; i++) {
			System.out.println("For Loop: " + i);
		}

		// For-each loop
		int[] arr = { 5, 3, 8, 1 };
		for (int num : arr) {
			System.out.println("ForEach: " + num);
		}

		// Sorting
		Arrays.sort(arr);
		System.out.println("Sorted: " + Arrays.toString(arr));

		// Switch
		int day = 2;
		switch (day) {
		case 1:
			System.out.println("Monday");
			break;
		case 2:
			System.out.println("Tuesday");
			break;
		default:
			System.out.println("Other day");
		}
	}
}