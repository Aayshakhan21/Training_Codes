package com.wipro.dsa;

import java.util.ArrayList;
import java.util.List;

// Given an integer array nums, find all elements that appear more than n/3 times.

public class MajorityElementNby3 {

	public static void main(String[] args) {

		int[] arr = { 1, 1, 1, 3, 3, 2, 2, 2 };

		Integer candidate1 = null, candidate2 = null;
		int count1 = 0, count2 = 0;

		for (int num : arr) {
			if (candidate1 != null && num == candidate1)
				count1++;
			else if (candidate2 != null && num == candidate2)
				count2++;
			else if (count1 == 0) {
				candidate1 = num;
				count1 = 1;
			} else if (count2 == 0) {
				candidate2 = num;
				count2 = 1;
			} else {
				count1--;
				count2--;
			}
		}

		// verify
		count1 = count2 = 0;
		for (int num : arr) {
			if (num == candidate1)
				count1++;
			else if (num == candidate2)
				count2++;
		}

		List<Integer> result = new ArrayList<>();
		if (count1 > arr.length / 3)
			result.add(candidate1);
		if (count2 > arr.length / 3)
			result.add(candidate2);

		System.out.println(result);
	}
}