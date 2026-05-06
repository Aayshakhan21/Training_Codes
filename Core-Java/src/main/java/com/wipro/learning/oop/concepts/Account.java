package com.wipro.learning.oop.concepts;

public class Account {
    // Private variables (Hidden from outside world)
    private double balance;

    // Public Getter
    public double getBalance() {
        return balance;
    }

    // Public Setter with Logic/Validation
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        } else {
            System.out.println("Invalid Deposit Amount!");
        }
    }
}