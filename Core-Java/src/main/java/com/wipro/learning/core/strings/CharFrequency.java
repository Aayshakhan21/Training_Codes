package com.wipro.learning.core.strings;

public class CharFrequency {

	public static int count(String str, char target) {
		int count = 0;

		for (int i = 0; i < str.length(); i++) {
			if (str.charAt(i) == target) {
				count++;
			}
		}

		return count;
	}

	public static void main(String[] args) {
		System.out.println(count("banana", 'a'));
		System.out.println(count("sakshi", 's'));
		System.out.println(count("banana", 'b'));
	}
}