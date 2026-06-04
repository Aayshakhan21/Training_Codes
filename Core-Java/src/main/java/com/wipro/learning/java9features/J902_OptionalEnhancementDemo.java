package com.wipro.learning.java9features;

import java.util.Optional;

public class J902_OptionalEnhancementDemo {

	public static void main(String[] args) {

		Optional<String> name = Optional.of("Vishal");

		name.ifPresentOrElse(x -> System.out.println(x), () -> System.out.println("No Value"));
	}
}