package com.wipro.learning.designpatterns;

public class DecoratorDemo {

	public static void main(String[] args) {

		Coffee coffee = new SimpleCoffee();

		// Add milk
		coffee = new MilkDecorator(coffee);

		// Add sugar
		coffee = new SugarDecorator(coffee);

		System.out.println(coffee.getDescription());
		System.out.println("Total Cost: " + coffee.getCost());
	}
}

// Step 1: Component Interface
interface Coffee {
	String getDescription();

	int getCost();
}

// Step 2: Concrete Component
class SimpleCoffee implements Coffee {

	public String getDescription() {
		return "Simple Coffee";
	}

	public int getCost() {
		return 50;
	}
}

// Step 3: Base Decorator
abstract class CoffeeDecorator implements Coffee {

	protected Coffee coffee;

	public CoffeeDecorator(Coffee coffee) {
		this.coffee = coffee;
	}
}

// Step 4: Concrete Decorators

class MilkDecorator extends CoffeeDecorator {

	public MilkDecorator(Coffee coffee) {
		super(coffee);
	}

	public String getDescription() {
		return coffee.getDescription() + " + Milk";
	}

	public int getCost() {
		return coffee.getCost() + 20;
	}
}

class SugarDecorator extends CoffeeDecorator {

	public SugarDecorator(Coffee coffee) {
		super(coffee);
	}

	public String getDescription() {
		return coffee.getDescription() + " + Sugar";
	}

	public int getCost() {
		return coffee.getCost() + 10;
	}
}