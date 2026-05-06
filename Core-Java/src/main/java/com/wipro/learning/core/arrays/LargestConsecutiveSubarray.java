package com.wipro.learning.core.arrays;

import java.util.HashSet;

public class LargestConsecutiveSubarray {

	public static void main(String[] args) {

		int[] nums = { 2, 5, 0, 2, 1, 4, 3, 6, 1, 0 };

		int start = 0, end = 0;
		int maxLength = 0;

		for (int i = 0; i < nums.length; i++) {

			HashSet<Integer> set = new HashSet<>();
			int min = nums[i], max = nums[i];

			for (int j = i; j < nums.length; j++) {

				if (set.contains(nums[j]))
					break;

				set.add(nums[j]);

				min = Math.min(min, nums[j]);
				max = Math.max(max, nums[j]);

				if (max - min == j - i) {
					if (j - i + 1 > maxLength) {
						maxLength = j - i + 1;
						start = i;
						end = j;
					}
				}
			}
		}

		System.out.println("Largest sub-array: [" + start + ", " + end + "]");
		System.out.print("Elements: ");

		for (int i = start; i <= end; i++) {
			System.out.print(nums[i] + " ");
		}
	}
}