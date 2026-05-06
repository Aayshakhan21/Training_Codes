package com.wipro.learning.collections;

import java.util.HashSet;

		//             Unique Email Registration[HashSet]
		// 		Ensure no duplicate email is registered in the system.

public class UniqueEmailRegistration {

	public static void main(String[] args) {

		HashSet<String> emails = new HashSet<>();

		// Try adding emails
		System.out.println(emails.add("vishal12kl@gmail.com")); // true
		System.out.println(emails.add("vishalshah@gmail.com")); // true
		System.out.println(emails.add("vishal12kl@gmail.com")); // false (duplicate)

		System.out.println("\nRegistered Emails:");
		for (String email : emails) {
			System.out.println(email);
		}
	}
}