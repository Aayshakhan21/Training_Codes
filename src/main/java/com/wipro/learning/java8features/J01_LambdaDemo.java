package com.wipro.learning.java8features;

public class J01_LambdaDemo {

	public static void main(String[] args) {

		// Old way using anonymous class:
		Runnable r1 = new Runnable() {
			public void run() {
				System.out.println("Old style");
			}
		};

		// Java 8 Lambda way
		Runnable r2 = () -> System.out.println("Lambda style");

		r1.run();
		r2.run();
	}
}

