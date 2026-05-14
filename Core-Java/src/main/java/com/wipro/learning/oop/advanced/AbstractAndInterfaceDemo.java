package com.wipro.learning.oop.advanced;

interface Vehicle {
	void start();

	default void fuelType() {
		System.out.println("Petrol/Diesel");
	}

	static void info() {
		System.out.println("Vehicle Interface");
	}
}

abstract class Car {
	abstract void drive();

	final void brand() {
		System.out.println("Generic Brand");
	}
}

class BMW extends Car implements Vehicle {

	public void start() {
		System.out.println("BMW Starting...");
	}

	void drive() {
		System.out.println("BMW Driving...");
	}
}

public class AbstractAndInterfaceDemo {
	public static void main(String[] args) {
		BMW b = new BMW();
		b.start();
		b.drive();
		b.brand();
		b.fuelType();
		Vehicle.info();
	}
}