package com.wipro.learning.core.arrays;

import java.util.Scanner;

public class UserLanguagesArray {

	public static void main(String[] args) {

		Scanner sc = new Scanner(System.in);

		// Enter the size of string
		System.out.println("How manay languages you know? ");
		int size = sc.nextInt();

		// stored in a array
		String languages[] = new String[size];

		// enter the languages based on size

		System.out.println("enter the languages ");
		for (int i = 0; i < languages.length; i++)
			languages[i] = sc.next();

		System.out.println("user entered the following languages ");

		for (int i = 0; i < languages.length; i++) {
			System.out.println(languages[i]);

		}
		
		sc.close();

	}

}
