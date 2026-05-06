package com.wipro.learning.controlflow;

public class VowelConsonantChecker {

	public static void main(String args[]) {

		// find character contains vowels and consonants using Switch statement

		char alphabet = 'e'; // (a,e,i,o,u)

		switch (alphabet) {
		case 'a':
			System.out.println(alphabet + " is vowel");
			break;
		case 'e':
			System.out.println(alphabet + " is vowel");
			break;
		case 'i':
			System.out.println(alphabet + " is vowel");
			break;
		case 'o':
			System.out.println(alphabet + " is vowel");
			break;
		case 'u':
			System.out.println(alphabet + " is vowel");
			break;
		default:
			System.out.println(alphabet + " is consonent");

		}

	}
}
