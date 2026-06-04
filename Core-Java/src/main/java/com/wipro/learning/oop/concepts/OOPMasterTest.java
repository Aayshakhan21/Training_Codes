package com.wipro.learning.oop.concepts;

public class OOPMasterTest {
	public static void main(String[] args) {

		// 1. TESTING ENCAPSULATION
		System.out.println("=== ENCAPSULATION TEST ===");
		
		Account vishalAcc = new Account();
		
		vishalAcc.deposit(1000.0); // Deposited 1000
		System.out.println("Account Balance Accessed via Getter: " + vishalAcc.getBalance()); 

		// 2. TESTING POLYMORPHISM (Method Overriding)
		System.out.println("\n=== POLYMORPHISM TEST ===");
		
		Animal myAnimal = new Animal();
		Animal myDog = new Dog(); // Upcasting: Parent reference, Child object

		myAnimal.speak(); // Output: Animal makes a sound
		myDog.speak(); // Output: Dog barks (Dynamic Method Dispatch)

		// 3. TESTING ABSTRACTION (Abstract Classes)
		System.out.println("\n=== ABSTRACTION TEST ===");

		Payment upi = new UPIPayment();
		Payment card = new CardPayment();

		upi.processPayment();
		card.processPayment();

		// 4. TESTING INHERITANCE (from previous example)
		System.out.println("\n=== INHERITANCE TEST ===");
		
		Developer dev = new Developer();
		
		dev.id = 101;
		dev.name = "Vishal"; // Accessing property from Parent

		dev.displayDetails(); // Calling method from Parent
		dev.showRole(); // Calling method from Child
	}

}
