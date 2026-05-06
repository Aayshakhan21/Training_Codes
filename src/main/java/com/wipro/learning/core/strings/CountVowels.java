package com.wipro.learning.core.strings;

public class CountVowels {

	public static int count(String str) {
		int count = 0;
		str = str.toLowerCase();

		for (int i = 0; i < str.length(); i++) {
			char ch = str.charAt(i);

			if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
				count++;
			}
		}

		return count;
	}

	public static void main(String[] args) {
		System.out.println(count("hello"));
	}
}