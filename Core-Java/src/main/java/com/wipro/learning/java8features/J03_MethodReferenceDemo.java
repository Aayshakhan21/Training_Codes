package com.wipro.learning.java8features;

import java.util.*;

public class J03_MethodReferenceDemo {

	public static void main(String[] args) {

		List<String> names = Arrays.asList("Vishal", "Aman", "Ravi");

		// Lambda
		names.forEach(x -> System.out.println(x));

		// Method reference
		names.forEach(System.out::println);
	}
}