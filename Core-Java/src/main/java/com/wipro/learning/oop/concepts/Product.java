package com.wipro.learning.oop.concepts;

public class Product {

	/*
	 * 
	 * 4. Problem Statement Create a shopping cart system. Requirements: Class
	 * Product Fields: name, price, quantity Constructor to initialize product
	 * Methods: calculateTotalPrice() Create multiple products and calculate total
	 * bill
	 * 
	 */

	private String name;
	private double price;
	private int quantity;

	Product(String name, double price, int quantity) {
		this.setName(name);
		this.price = price;
		this.quantity = quantity;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	double calculateTotalPrice() {
		return price * quantity;
	}

	public static void main(String[] args) {
		Product p1 = new Product("Pen", 10, 2);
		Product p2 = new Product("Book", 50, 1);

		double total = p1.calculateTotalPrice() + p2.calculateTotalPrice();
		System.out.println(total);
	}

}