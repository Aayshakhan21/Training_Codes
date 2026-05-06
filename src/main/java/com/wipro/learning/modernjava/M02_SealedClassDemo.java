/*

	package com.wipro.learning.modernjava;
	
	// Only Car and Bike can extend Vehicle
	// Sealed classes restrict which classes can inherit.
	// You control inheritance.
	
	
	sealed class Vehicle permits Car, Bike
	{
		}
	
		final class Car extends Vehicle {
		}
	
		final class Bike extends Vehicle {
		}
	
		public class M02_SealedClassDemo {
	
			public static void main(String[] args) {
	
				Vehicle v = new Car();
	
				System.out.println("Car object created");
			}
	}

*/