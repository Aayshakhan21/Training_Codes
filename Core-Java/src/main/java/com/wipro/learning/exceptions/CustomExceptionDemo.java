package com.wipro.learning.exceptions;

@SuppressWarnings("serial")
class InvalidAmountException extends Exception {
	
	public InvalidAmountException(String msg) {
		super(msg);
	}
}

public class CustomExceptionDemo {

	static void withdraw(double amount) throws InvalidAmountException {
		if (amount <= 0) {
			throw new InvalidAmountException("Amount must be > 0");
		}
		System.out.println("Withdrawal successful");
	}

	public static void main(String[] args) {
		try {
			withdraw(-100);
		} catch (InvalidAmountException e) {
			System.out.println(e.getMessage());
		}
	}
}