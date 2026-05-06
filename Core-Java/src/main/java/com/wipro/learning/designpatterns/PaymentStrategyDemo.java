package com.wipro.learning.designpatterns;

public class PaymentStrategyDemo {

	public static void main(String[] args) {

		// Context
		PaymentService service = new PaymentService();

		// Strategy 1: UPI
		service.setPaymentStrategy(new UpiPayment());
		service.pay(500);

		// Strategy 2: Credit Card
		service.setPaymentStrategy(new CreditCardPayment());
		service.pay(1200);

		// Strategy 3: Cash
		service.setPaymentStrategy(new CashPayment());
		service.pay(300);
	}
}

// 1. Strategy Interface
interface PaymentStrategy {
	void pay(double amount);
}

// 2. Concrete Strategies

class UpiPayment implements PaymentStrategy {
	public void pay(double amount) {
		System.out.println("Paid ₹" + amount + " using UPI");
	}
}

class CreditCardPayment implements PaymentStrategy {
	public void pay(double amount) {
		System.out.println("Paid ₹" + amount + " using Credit Card");
	}
}

class CashPayment implements PaymentStrategy {
	public void pay(double amount) {
		System.out.println("Paid ₹" + amount + " using Cash");
	}
}

// 3. Context Class
class PaymentService {

	private PaymentStrategy strategy;

	// Set strategy at runtime
	public void setPaymentStrategy(PaymentStrategy strategy) {
		this.strategy = strategy;
	}

	public void pay(double amount) {
		if (strategy == null) {
			throw new IllegalStateException("Payment strategy not set");
		}
		strategy.pay(amount);
	}
}