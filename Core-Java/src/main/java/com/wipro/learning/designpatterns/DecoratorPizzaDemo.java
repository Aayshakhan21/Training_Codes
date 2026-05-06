package com.wipro.learning.designpatterns;

public class DecoratorPizzaDemo {
	
	public static void main(String[] args) {

		Pizza pizza = new CheezePizza();

		// Add Cheeze Pizza
		pizza = new CheezeDecorator(pizza);

		// Add Farm House Pizza
		pizza = new FarmHouseDecorator(pizza);

		System.out.println(pizza.getDescription());
		System.out.println("Total Cost: " + pizza.getCost());
	}
	
}

	//Step 1: Component Interface
	interface Pizza {
		String getDescription();
	
		int getCost();
	}
	
	//Step 2: Concrete Component
	class CheezePizza implements Pizza {
	
		public String getDescription() {
			return "Simple Pizza";
		}
	
		public int getCost() {
			return 210;
		}
	}
	
	//Step 3: Base Decorator
	abstract class PizzaDecorator implements Pizza {
	
		protected Pizza pizza;
	
		public PizzaDecorator(Pizza pizza) {
			this.pizza = pizza;
		}
	}
	
	//Step 4: Concrete Decorators
	
	class CheezeDecorator extends PizzaDecorator {
	
		public CheezeDecorator(Pizza pizza) {
			super(pizza);
		}
	
		public String getDescription() {
			return pizza.getDescription() + " + Margherita Cheeze Pizza";
		}
	
		public int getCost() {
			return pizza.getCost() + 420;
		}
	}
	
	class FarmHouseDecorator extends PizzaDecorator {
	
		public FarmHouseDecorator(Pizza pizza) {
			super(pizza);
		}
	
		public String getDescription() {
			return pizza.getDescription() + " + Farm House Pizza";
		}
	
		public int getCost() {
			return pizza.getCost() + 610;
		}
	}
