package com.wipro.learning.designpatterns;

public class FactoryDemoPayment {

	public static void main(String[] args) {

		Payment p1 = PaymentFactory.getPayment("upi");
		p1.pay(500);

		Payment p2 = PaymentFactory.getPayment("card");
		p2.pay(1200);

		Payment p3 = PaymentFactory.getPayment("cash");
		p3.pay(300);
	}
}

// 1. Interface (common behavior)
interface Payment {
	void pay(double amount);
}

// 2. Concrete Classes

class UPI implements Payment {
	public void pay(double amount) {
		System.out.println("Paid ₹" + amount + " using UPI");
	}
}

class CreditCard implements Payment {
	public void pay(double amount) {
		System.out.println("Paid ₹" + amount + " using Credit Card");
	}
}

class Cash implements Payment {
	public void pay(double amount) {
		System.out.println("Paid ₹" + amount + " using Cash");
	}
}

// 3. Factory Class

class PaymentFactory {

	public static Payment getPayment(String type) {

		if (type == null)
			return null;

		if (type.equalsIgnoreCase("upi")) {
			return new UPI();
		} else if (type.equalsIgnoreCase("card")) {
			return new CreditCard();
		} else if (type.equalsIgnoreCase("cash")) {
			return new Cash();
		}

		throw new IllegalArgumentException("Invalid payment type");
	}
}