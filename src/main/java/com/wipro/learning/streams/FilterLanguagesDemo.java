package com.wipro.learning.streams;

import java.util.*;

public class FilterLanguagesDemo {

	public static void main(String[] args) {

		List<String> list = new ArrayList<>();

		list.add("java");
		list.add("c++");
		list.add("c");
		list.add("angular");
		list.add("javascript");
		list.add("jquery");
		list.add("python");
		list.add("c#");
		list.add("react");
		list.add("rust");

		// Stream → filter → print
		list.stream().filter(x -> x.startsWith("j")) // condition
				.forEach(System.out::println); // print
	}
}