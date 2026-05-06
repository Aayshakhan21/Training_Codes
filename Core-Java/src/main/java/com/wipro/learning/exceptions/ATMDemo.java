package com.wipro.learning.exceptions;

import java.util.Scanner;

// Custom Exception
class InsufficientBalanceException extends Exception {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}

// Bank Account Class
class BankAccount {
    private double balance;

    public BankAccount(double balance) {
        this.balance = balance;
    }

    public void deposit(double amount) throws IllegalArgumentException {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit must be positive");
        }
        balance += amount;
        System.out.println("Deposited: " + amount);
    }

    public void withdraw(double amount) throws InsufficientBalanceException {
        if (amount > balance) {
            throw new InsufficientBalanceException("Not enough balance");
        }
        balance -= amount;
        System.out.println("Withdrawn: " + amount);
    }

    public void checkBalance() {
        System.out.println("Current Balance: " + balance);
    }
}

// ATM Main Class
public class ATMDemo {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        BankAccount account = new BankAccount(10000);

        boolean running = true;

        while (running) {

            System.out.println("\n==== ATM MENU ====");
            System.out.println("1. Deposit");
            System.out.println("2. Withdraw");
            System.out.println("3. Check Balance");
            System.out.println("4. Exit");
            System.out.print("Choose option: ");

            try {
                int choice = sc.nextInt();

                switch (choice) {

                    case 1:
                        System.out.print("Enter amount: ");
                        double dep = sc.nextDouble();
                        account.deposit(dep);
                        break;

                    case 2:
                        System.out.print("Enter amount: ");
                        double wit = sc.nextDouble();
                        account.withdraw(wit);
                        break;

                    case 3:
                        account.checkBalance();
                        break;

                    case 4:
                        running = false;
                        System.out.println("Thank you!");
                        break;

                    default:
                        System.out.println("Invalid option");
                }

            } catch (InsufficientBalanceException e) {
                System.out.println("Error: " + e.getMessage());

            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());

            } catch (Exception e) {
                System.out.println("Invalid input! Please enter numbers only.");
                sc.nextLine(); // clear buffer
            }
        }

        sc.close();
    }
}