package com.wipro.dsa;

import java.util.HashSet;

// Given an array of integers, find all duplicates in the array.

public class FindDuplicates {

	public static void main(String[] args) {

		int[] arr = { 4, 3, 2, 7, 8, 2, 3, 1 };

		HashSet<Integer> seen = new HashSet<>();
		HashSet<Integer> duplicates = new HashSet<>();

		for (int num : arr) {
			if (!seen.add(num)) {
				duplicates.add(num);
			}
		}

		System.out.println("Duplicates: " + duplicates);
	}
}