package com.wipro.learning.java8features;

import java.util.*;

public class J04_StreamFilterDemo {

	public static void main(String[] args) {

		List<Integer> list = Arrays.asList(10, 15, 20, 25, 30);

		// Print even numbers
		list.stream().filter(x -> x % 2 == 0).forEach(System.out::println);
	}
}