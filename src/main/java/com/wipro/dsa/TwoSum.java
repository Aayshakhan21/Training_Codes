package com.wipro.dsa;

import java.util.HashMap;

// Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to the target.

public class TwoSum {

	public static void main(String[] args) {

		int[] arr = { 2, 7, 11, 15 };
		int target = 9;

		HashMap<Integer, Integer> map = new HashMap<>();

		for (int i = 0; i < arr.length; i++) {
			int complement = target - arr[i];

			if (map.containsKey(complement)) {
				System.out.println("Indices: " + map.get(complement) + ", " + i);
				return;
			}
			map.put(arr[i], i);
		}
	}
}