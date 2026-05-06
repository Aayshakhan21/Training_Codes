package com.wipro.learning.core.strings;

import java.util.Scanner;

public class StringImmutabilityDemo {

	public static void main(String[] args) {

		Scanner sc = new Scanner(System.in);
		String email = "sakshi12@gmail.com"; // immutable - cannot be changed
		System.out.println(email.toUpperCase());
		System.out.println(email.concat("email"));
		System.out.println(email.startsWith("s"));
		System.out.println(email);

		// these two classes are mutable

		StringBuilder buil = new StringBuilder("sakshi12@gmail.com");
		buil.append("email");
		System.out.println(buil);

		StringBuffer buff = new StringBuffer("sakshi12@gmail.com");
		buff.append("email");
		System.out.println(buff);
		
		sc.close();
	}

}
