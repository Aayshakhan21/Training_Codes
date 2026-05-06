package com.wipro.learning.oop.concepts;

class Animal {
	void speak() {
		System.out.println("Animal makes a sound");
	}
	
}

class Dog extends Animal {
	@Override
    void speak() { // Example of Method Overriding
        System.out.println("Dog says: Woof Woof!"); 
    }
	
}



public class AnimalDemo {
	public static void main(String[] args) {
		Animal myPet = new Dog();
		myPet.speak(); 
	}
}