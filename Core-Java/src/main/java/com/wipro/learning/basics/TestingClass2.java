	package com.wipro.learning.basics;
	
	public class TestingClass2 {
	
		// Reverse String
		public static String reverseString(String str) {
			String reversed = "";
			for (int i = str.length() - 1; i >= 0; i--) {
				reversed += str.charAt(i);
			}
			return reversed;
		}
	
		// Count Vowels
		public static int countVowels(String str) {
			int count = 0;
			str = str.toLowerCase();
	
			for (char ch : str.toCharArray()) {
				if ("aeiou".indexOf(ch) != -1)
					count++;
			}
			return count;
		}
	
		// Count Consonants
		public static int countConsonants(String str) {
			int count = 0;
			str = str.toLowerCase();
	
			for (char ch : str.toCharArray()) {
				if (Character.isLetter(ch) && "aeiou".indexOf(ch) == -1) {
					count++;
				}
			}
			return count;
		}
	
		// Character Frequency
		public static int charFrequency(String str, char target) {
			int count = 0;
	
			for (char ch : str.toCharArray()) {
				if (ch == target)
					count++;
			}
			return count;
		}
	
		// Convert to Uppercase
		public static String toUpperCase(String str) {
			return str.toUpperCase();
		}
	
		// String Length
		public static int stringLength(String str) {
			return str.length();
		}
	
		// Palindrome (String)
		public static boolean isPalindromeString(String str) {
			String reversed = reverseString(str);
			return str.equalsIgnoreCase(reversed);
		}
	
		// Replace Consonants with '0'
		public static String replaceConsonants(String str) {
			String result = "";
			for (char ch : str.toCharArray()) {
				if (Character.isLetter(ch) && "aeiouAEIOU".indexOf(ch) == -1) {
					result += '0';
				} else {
					result += ch;
				}
			}
			return result;
		}
	
	}
