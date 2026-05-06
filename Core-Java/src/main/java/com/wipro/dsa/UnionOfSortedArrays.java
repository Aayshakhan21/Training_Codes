package com.wipro.dsa;

import java.util.ArrayList;
import java.util.List;

// Given two sorted arrays, arr1 and arr2, write a function to find the union of these two arrays. The union of two arrays is a list that includes all elements from both arrays. Since the arrays are sorted, the union should also be sorted. Duplicates from each array should be preserved in the result.

public class UnionOfSortedArrays {

	public static void main(String[] args) {

		int[] arr1 = { 1, 2, 3, 4, 5 };
		int[] arr2 = { 1, 2, 3, 6, 7 };

		int i = 0, j = 0;
		List<Integer> result = new ArrayList<>();

		while (i < arr1.length && j < arr2.length) {
			if (arr1[i] < arr2[j]) {
				result.add(arr1[i++]);
			} else if (arr1[i] > arr2[j]) {
				result.add(arr2[j++]);
			} else {
				result.add(arr1[i]);
				i++;
				j++;
			}
		}

		while (i < arr1.length)
			result.add(arr1[i++]);
		while (j < arr2.length)
			result.add(arr2[j++]);

		System.out.println(result);
	}
}