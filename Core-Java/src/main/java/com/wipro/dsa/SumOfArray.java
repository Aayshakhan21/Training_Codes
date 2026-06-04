package com.wipro.dsa;

public class SumOfArray {
	public static void main(String[] args) {

		int[] arr = { 1, 2, 3, 4 };
		int sum = 0;

		for (int num : arr)
			sum += num;

		System.out.println("Sum: " + sum);
	}
}