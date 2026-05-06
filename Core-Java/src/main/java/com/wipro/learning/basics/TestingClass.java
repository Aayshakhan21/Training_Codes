package com.wipro.learning.basics;

public class TestingClass {

		// Prime Number
	    public static boolean isPrime(int num) {
	        if (num <= 1) return false;

	        for (int i = 2; i <= Math.sqrt(num); i++) {
	            if (num % i == 0) return false;
	        }
	        return true;
	    }
	    
	    // Reverse an Array
	    public static int[] reverse(int[] arr) {
	        int left = 0, right = arr.length - 1;

	        while (left < right) {
	            int temp = arr[left];
	            arr[left] = arr[right];
	            arr[right] = temp;
	            left++;
	            right--;
	        }
	        return arr;
	    }
	    
	    // Max / Min in Array
	    public static int[] findMaxMin(int[] arr) {
	        int max = arr[0], min = arr[0];

	        for (int num : arr) {
	            if (num > max) max = num;
	            if (num < min) min = num;
	        }

	        return new int[]{max, min};
	    }
	    
	    // Palindrome 
	    public static boolean isPalindrome(int num) {
	        int original = num;
	        int reversed = 0;

	        while (num > 0) {
	            int digit = num % 10;
	            reversed = reversed * 10 + digit;
	            num /= 10;
	        }

	        return original == reversed;
	    }
	    
	    // Vowels & Consonant
	    public static String check(char ch) {
	        ch = Character.toLowerCase(ch);

	        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
	            return "Vowel";
	        } else {
	            return "Consonant";
	        }
	    }    
	    
	    // Odd / Even
	    public static String check(int num) {
	        return (num % 2 == 0) ? "Even" : "Odd";
	    }
}
