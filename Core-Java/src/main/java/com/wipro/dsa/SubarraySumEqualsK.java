package com.wipro.dsa;

import java.util.HashMap;

// Given an array of integers numsand an integer k, return the total number of continuous subarrays whose sum equals to k.

public class SubarraySumEqualsK {

	public static void main(String[] args) {

		int[] arr = { 1, 1, 1, -1 };
		int k = 2;

		HashMap<Integer, Integer> map = new HashMap<>();
		int sum = 0, count = 0;

		for (int num : arr) {
			sum += num;

			if (sum == k)
				count++;

			if (map.containsKey(sum - k)) {
				count += map.get(sum - k);
			}

			map.put(sum, map.getOrDefault(sum, 0) + 1);
		}

		System.out.println("Count: " + count);
	}
}