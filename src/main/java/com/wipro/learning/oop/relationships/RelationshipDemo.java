package com.wipro.learning.oop.relationships;
	
	class Engine {
		void start() {
			System.out.println("Engine started");
		}
	}
	
	// Composition
	class Car {
		private Engine engine = new Engine();
	
		void startCar() {
			engine.start();
		}
	}
	
	// Aggregation
	class Driver {
		String name;
	
		Driver(String name) {
			this.name = name;
		}
	}
	
	class Vehicle {
		Driver driver;
	
		Vehicle(Driver driver) {
			this.driver = driver;
		}
	}
	
	public class RelationshipDemo {
	
		// Overloading
		static int add(int a, int b) {
			return a + b;
		}
	
		static double add(double a, double b) {
			return a + b;
		}
	
		public static void main(String[] args) {
	
			Car car = new Car();
			car.startCar();
	
//			Driver d = new Driver("Vishal");
//			Vehicle v = new Vehicle(d);
	
			System.out.println(add(2, 3));
			System.out.println(add(2.5, 3.5));
		}
	}