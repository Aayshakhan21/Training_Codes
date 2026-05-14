package com.wipro.dsa;

public class FindIndexInArray {
	public static void main(String[] args) {

		int[] arr = { 10, 20, 30 };
		int target = 20;

		for (int i = 0; i < arr.length; i++) {
			if (arr[i] == target) {
				System.out.println("Index: " + i);
				break;
			}
		}
	}
}