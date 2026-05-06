package com.wipro.dsa;

import java.util.HashMap;

// Given a list of integers, find the element that appears the most frequently.

public class MostFrequentElement {

	public static void main(String[] args) {

		int[] arr = { 1, 3, 2, 1, 2, 2, 3, 3, 3, 1 };

		HashMap<Integer, Integer> map = new HashMap<>();

		int maxFreq = 0;
		int result = -1;

		for (int num : arr) {
			map.put(num, map.getOrDefault(num, 0) + 1);

			if (map.get(num) > maxFreq) {
				maxFreq = map.get(num);
				result = num;
			}
		}

		System.out.println("Most Frequent: " + result);
	}
}