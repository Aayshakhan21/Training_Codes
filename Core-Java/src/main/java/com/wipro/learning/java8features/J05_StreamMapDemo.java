package com.wipro.learning.java8features;

import java.util.*;

public class J05_StreamMapDemo {

	public static void main(String[] args) {

		List<Integer> marks = Arrays.asList(10, 20, 30);

		// Add 5 marks
		marks.stream().map(x -> x + 5).forEach(System.out::println);
	}
}