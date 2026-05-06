package com.wipro.learning.java8features;

import java.util.function.Consumer;
import java.util.function.Supplier;

public class J10_ConsumerSupplierDemo {

	public static void main(String[] args) {

		Consumer<String> c = x -> System.out.println(x);

		c.accept("Hello");

		Supplier<String> s = () -> "Generated Value";

		System.out.println(s.get());
	}
}