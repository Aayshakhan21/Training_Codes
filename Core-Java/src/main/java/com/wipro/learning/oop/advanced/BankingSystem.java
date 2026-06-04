package com.wipro.learning.oop.advanced;

import java.util.Scanner;

public class BankingSystem {

	static Scanner scanner = new Scanner(System.in);
	static double balance = 10000.00; // Starting balance
	static String accountType = "";

	public static void main(String[] args) {

		// Step 1: Choose account type
		selectAccountType();

		// Step 2: Main transaction menu
		mainMenu();

		System.out.println("\nThank you for using Java Bank. Goodbye!");
		scanner.close();
	}

	// ─── Account Type Selection ───────────────────────────────────────────────
	static void selectAccountType() {
		System.out.println("\nSelect Account Type:");
		System.out.println("  1. Debit Account");
		System.out.println("  2. Credit Account");
		System.out.print("Enter choice (1 or 2): ");

		int choice = getIntInput();

		switch (choice) {
		case 1:
			accountType = "Debit";
			System.out.println("✔ Debit Account selected.");
			break;
		case 2:
			accountType = "Credit";
			System.out.println("✔ Credit Account selected.");
			break;
		default:
			System.out.println("Invalid choice. Defaulting to Debit Account.");
			accountType = "Debit";
		}
	}

	// ─── Main Transaction Menu ────────────────────────────────────────────────
	static void mainMenu() {
		boolean running = true;

		while (running) {
			System.out.println("\n========================================");
			System.out.println("  Account Type : " + accountType);
			System.out.printf("  Current Balance: ₹%.2f%n", balance);
			System.out.println("========================================");
			System.out.println("  1. Deposit");
			System.out.println("  2. Withdraw");
			System.out.println("  3. Check Balance");
			System.out.println("  4. Continue (back to account selection)");
			System.out.println("  5. Exit");
			System.out.println("========================================");
			System.out.print("Enter your choice: ");

			int choice = getIntInput();

			switch (choice) {
			case 1:
				deposit();
				break;
			case 2:
				withdraw();
				break;
			case 3:
				checkBalance();
				break;
			case 4:
				System.out.println("\nReturning to account selection...");
				selectAccountType();
				break;
			case 5:
				running = false;
				break;
			default:
				System.out.println(" Invalid option. Please try again.");
			}
		}
	}

	// ─── Deposit ──────────────────────────────────────────────────────────────
	static void deposit() {
		System.out.print("\nEnter amount to deposit: ₹");
		double amount = getDoubleInput();

		if (amount <= 0) {
			System.out.println(" Deposit amount must be greater than 0.");
			return;
		}

		balance += amount;
		System.out.printf("✔ ₹%.2f deposited successfully.%n", amount);
		System.out.printf("  New Balance: ₹%.2f%n", balance);
	}

	// ─── Withdraw ─────────────────────────────────────────────────────────────
	static void withdraw() {
		System.out.print("\nEnter amount to withdraw: ₹");
		double amount = getDoubleInput();

		if (amount <= 0) {
			System.out.println(" Withdrawal amount must be greater than 0.");
			return;
		}

		// Debit: cannot go below 0. Credit: allow up to ₹50,000 overdraft
		if (accountType.equals("Debit") && amount > balance) {
			System.out.println(" Insufficient balance in your Debit account.");
			System.out.printf("  Available Balance: ₹%.2f%n", balance);
			return;
		}

		if (accountType.equals("Credit") && (balance - amount) < -50000) {
			System.out.println(" Credit limit exceeded. Max overdraft: ₹50,000.");
			return;
		}

		balance -= amount;
		System.out.printf("✔ ₹%.2f withdrawn successfully.%n", amount);
		System.out.printf("  Remaining Balance: ₹%.2f%n", balance);

		if (balance < 0) {
			System.out.printf("  ⚠ You are in credit overdraft of ₹%.2f%n", Math.abs(balance));
		}
	}

	// ─── Check Balance ────────────────────────────────────────────────────────
	static void checkBalance() {
		System.out.println("\n──── Account Summary ────");
		System.out.println("  Account Type : " + accountType);
		System.out.printf("  Balance      : ₹%.2f%n", balance);
		if (balance < 0) {
			System.out.println("  Status       : Overdraft (Credit)");
		} else if (balance < 500) {
			System.out.println("  Status       :  Low Balance");
		} else {
			System.out.println("  Status       :  Good Standing");
		}
		System.out.println("─────────────────────────");
	}

	// ─── Safe Input Helpers ───────────────────────────────────────────────────
	static int getIntInput() {
		while (!scanner.hasNextInt()) {
			System.out.print("Invalid input. Enter a number: ");
			scanner.next();
		}
		return scanner.nextInt();
	}

	static double getDoubleInput() {
		while (!scanner.hasNextDouble()) {
			System.out.print("Invalid input. Enter a valid amount: ");
			scanner.next();
		}
		return scanner.nextDouble();
	}

}
