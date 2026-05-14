package com.wipro.dsa;

import java.util.Arrays;

public class RemoveElement {
	public static void main(String[] args) {

		int[] arr = { 1, 2, 3, 4 };
		int remove = 3;

		int[] result = new int[arr.length - 1];
		int index = 0;

		for (int num : arr) {
			if (num != remove) {
				result[index++] = num;
			}
		}

		System.out.println(Arrays.toString(result));
	}
}