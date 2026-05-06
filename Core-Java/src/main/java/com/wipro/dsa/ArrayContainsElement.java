package com.wipro.dsa;

public class ArrayContainsElement {
	public static void main(String[] args) {

		int[] arr = { 1, 2, 3 };
		int target = 2;

		boolean found = false;

		for (int num : arr) {
			if (num == target)
				found = true;
		}

		System.out.println(found);
	}
}