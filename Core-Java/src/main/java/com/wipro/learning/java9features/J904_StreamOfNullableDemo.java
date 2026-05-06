package com.wipro.learning.java9features;

import java.util.stream.Stream;

public class J904_StreamOfNullableDemo {

	public static void main(String[] args) {

		String name = null;

		Stream.ofNullable(name).forEach(System.out::println);
	}
}