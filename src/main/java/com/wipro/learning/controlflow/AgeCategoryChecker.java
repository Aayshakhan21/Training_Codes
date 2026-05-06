package com.wipro.learning.controlflow;

public class AgeCategoryChecker {
	public static void main(String args[]) {

		// Check the person is adult, child and teenager based on their age.

		int age = 30;

		if (age > 19) {
			System.out.println("You are adult");
		} else if (age < 11) {
			System.out.println("you are a child");
		} else {
			System.out.println("you are a teenager");
		}

	}

}
