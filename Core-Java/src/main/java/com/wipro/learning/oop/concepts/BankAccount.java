package com.wipro.learning.oop.concepts;

public class BankAccount {

	/*
	 * 
	 * 2. Create a banking system to manage customer accounts. Requirements: Class
	 * BankAccount Fields: accountHolder, balance Constructor initializes values
	 * Methods: deposit(amount) withdraw(amount) (check insufficient balance)
	 * checkBalance() Simulate multiple transactions
	 *
	 */

	private String accountHolder;

	private double balance;

	public BankAccount(String accountHolder, double balance) {
		this.setAccountHolder(accountHolder);
		this.balance = balance;
	}

	public void deposit(double amount) {
		if (amount > 0) {
			balance += amount;
		} else {
			System.out.println("Invalid Amount");
		}
	}

	public void withdraw(double amount) {
		if (balance > 0) {
			balance -= amount;
		} else {
			System.out.println("Amount less than the amount");
		}
	}

	public void checkBalance() {
		System.out.println("Current Balance in my account is: " + balance);
	}

	public static void main(String[] args) {
		BankAccount bankaccount = new BankAccount("Vishal", 10000);
		bankaccount.checkBalance();
		bankaccount.deposit(20000);
		bankaccount.checkBalance();
		bankaccount.withdraw(15000);
		bankaccount.checkBalance();
	}

	public String getAccountHolder() {
		return accountHolder;
	}

	public void setAccountHolder(String accountHolder) {
		this.accountHolder = accountHolder;
	}

}
