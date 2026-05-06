package com.wipro.learning.java8features;

@FunctionalInterface
interface MyInterface {

	void show();
}

public class J02_FunctionalInterfaceDemo {

	public static void main(String[] args) {

		MyInterface obj = () -> System.out.println("Hello Java 8");

		obj.show();
	}
}