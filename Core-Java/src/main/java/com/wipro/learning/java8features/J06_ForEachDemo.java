package com.wipro.learning.java8features;

import java.util.*;

public class J06_ForEachDemo {

	public static void main(String[] args) {

		List<String> list = Arrays.asList("Java", "Python", "C++");

		list.forEach(System.out::println);
	}
}