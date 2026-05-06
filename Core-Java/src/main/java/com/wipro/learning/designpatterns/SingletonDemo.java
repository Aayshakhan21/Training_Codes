package com.wipro.learning.designpatterns;

public class SingletonDemo {

	public static void main(String[] args) {

		Singleton obj1 = Singleton.getInstance();
		Singleton obj2 = Singleton.getInstance();

		System.out.println(obj1 == obj2); // true
	}
}

class Singleton {

	// Step 1: create static instance
	private static Singleton instance;

	// Step 2: private constructor (no object from outside)
	private Singleton() {
		System.out.println("Singleton Object Created");
	}

	// Step 3: global access method
	public static Singleton getInstance() {

		if (instance == null) {
			instance = new Singleton(); // create only once
		}

		return instance;
	}
}