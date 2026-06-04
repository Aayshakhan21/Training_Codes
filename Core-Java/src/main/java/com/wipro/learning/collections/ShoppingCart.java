package com.wipro.learning.collections;

import java.util.ArrayList;

			//             				Shopping Cart[ArrayList]
			// 		Add, remove, and display items in a user’s shopping cart. Allow duplicate items.

public class ShoppingCart {

	public static void main(String[] args) {

		ArrayList<String> cart = new ArrayList<>();

		// Add items
		cart.add("Apple");
		cart.add("Milk");
		cart.add("Apple"); // duplicates allowed

		// Remove item
		cart.remove("Milk");

		// Display cart
		System.out.println("Items in Cart:");
		for (String item : cart) {
			System.out.println(item);
		}
	}
}