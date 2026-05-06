package com.wipro.learning.streams;

import java.util.*;

public class SalaryPrintDemo {

	public static void main(String[] args) {

		List<Integer> list = Arrays.asList(3000, 4000, 8000, 9000, 9000, 2000, 10000, 12000, 2000, 2500);

		list.stream().map(x -> x + 500).filter(x -> x > 3000).forEach(System.out::println);
	}
}