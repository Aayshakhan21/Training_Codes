package com.wipro.learning.oop.advanced;

interface Payment {
	void pay(double amount);
}

class CreditCard implements Payment {
	public void pay(double amount) {
		System.out.println("Paid " + amount + " using Credit Card");
	}
}

class UPI implements Payment {
	public void pay(double amount) {
		System.out.println("Paid " + amount + " using UPI");
	}
}

class Cash implements Payment {
	public void pay(double amount) {
		System.out.println("Paid " + amount + " using Cash");
	}
}

public class PaymentSystemDemo {
	public static void main(String[] args) {

		Payment p1 = new CreditCard();
		Payment p2 = new UPI();
		Payment p3 = new Cash();

		p1.pay(1000);
		p2.pay(500);
		p3.pay(200);
	}
}