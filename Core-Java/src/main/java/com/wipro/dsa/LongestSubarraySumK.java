package com.wipro.dsa;

import java.util.HashMap;

// Given an array of integers arr and an integer K, find the length of the longest sub-array whose sum is equal to K. If there is no such sub-array, return 0.

public class LongestSubarraySumK {

	public static void main(String[] args) {

		int[] arr = { 10, 5, 2, 7, 1, 9 };
		int k = 15;

		HashMap<Integer, Integer> map = new HashMap<>();

		int sum = 0, maxLen = 0;

		for (int i = 0; i < arr.length; i++) {
			sum += arr[i];

			if (sum == k)
				maxLen = i + 1;

			if (map.containsKey(sum - k)) {
				maxLen = Math.max(maxLen, i - map.get(sum - k));
			}

			if (!map.containsKey(sum)) {
				map.put(sum, i);
			}
		}

		System.out.println("Length: " + maxLen);
	}
}