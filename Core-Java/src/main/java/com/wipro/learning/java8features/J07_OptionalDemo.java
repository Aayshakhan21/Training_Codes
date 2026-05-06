package com.wipro.learning.java8features;

import java.util.Optional;

public class J07_OptionalDemo {

	public static void main(String[] args) {

		String name = null;

		Optional<String> value = Optional.ofNullable(name);

		System.out.println(value.orElse("Default Name"));
	}
}