package com.wipro.learning.java9features;

import java.util.List;
import java.util.Set;
import java.util.Map;

public class J901_ListSetMapFactoryDemo {

	public static void main(String[] args) {

		// Immutable List
		List<String> list = List.of("Java", "Python", "C++");

		Set<Integer> set = Set.of(10, 20, 30);

		Map<Integer, String> map = Map.of(1, "Vishal", 2, "Aman");

		System.out.println(list);
		System.out.println(set);
		System.out.println(map);
	}
}