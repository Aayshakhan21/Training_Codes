package com.wipro.learning.core.strings;

public class PalindromeString {

	public static boolean isPalindrome(String str) {
		String reversed = "";

		for (int i = str.length() - 1; i >= 0; i--) {
			reversed = reversed + str.charAt(i);
		}

		return str.equalsIgnoreCase(reversed);
	}

	public static void main(String[] args) {
		System.out.println(isPalindrome("madam"));
	}
}