package com.wipro.dsa;

public class MaxMinArray {
	public static void main(String[] args) {

		int[] arr = { 5, 2, 9, 1 };

		int max = arr[0], min = arr[0];

		for (int num : arr) {
			if (num > max)
				max = num;
			if (num < min)
				min = num;
		}

		System.out.println("Max: " + max + ", Min: " + min);
	}
}