package com.wipro.learning.core.arrays;

public class EvenNumberInArray {

	public static void main(String[] args) {

		int numbers[] = { 2, 3, 45, 6, 8 };

		for (int i = 0; i < numbers.length; i++) {
			if (numbers[i] % 2 == 0)
				System.out.println(numbers[i] + " is even");

		}

	}

}
