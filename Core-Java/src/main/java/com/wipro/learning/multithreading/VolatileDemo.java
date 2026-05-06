package com.wipro.learning.multithreading;

public class VolatileDemo {

	static volatile int x = 0;

	public static void main(String[] args) {

		Thread obj = new Thread(() -> {
			x = 8;
			System.out.println(x);
		});

		obj.start();

		Thread obj2 = new Thread(() -> {

			System.out.println(x);
		});

		obj2.start();

	}

}
