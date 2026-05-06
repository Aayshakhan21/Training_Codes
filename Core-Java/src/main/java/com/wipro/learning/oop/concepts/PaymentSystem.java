package com.wipro.learning.oop.concepts;

// Abstract Class: Cannot be instantiated
abstract class Payment {
	abstract void processPayment(); // No body, just a contract
}

class UPIPayment extends Payment {
	@Override
	void processPayment() {
		System.out.println("Processing UPI payment via Scanner...");
	}
}

class CardPayment extends Payment {
	@Override
	void processPayment() {
		System.out.println("Processing Card payment via Chip...");
	}
}