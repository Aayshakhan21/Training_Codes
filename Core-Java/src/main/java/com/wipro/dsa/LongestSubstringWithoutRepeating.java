package com.wipro.dsa;

import java.util.HashSet;

// Given a string, find the length of the longest substring without repeating characters.

public class LongestSubstringWithoutRepeating {

	public static void main(String[] args) {

		String s = "abcabcbb";

		HashSet<Character> set = new HashSet<>();

		int left = 0, maxLen = 0;

		for (int right = 0; right < s.length(); right++) {

			while (set.contains(s.charAt(right))) {
				set.remove(s.charAt(left));
				left++;
			}

			set.add(s.charAt(right));
			maxLen = Math.max(maxLen, right - left + 1);
		}

		System.out.println("Length: " + maxLen);
	}
}