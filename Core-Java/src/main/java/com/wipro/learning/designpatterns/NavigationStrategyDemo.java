package com.wipro.learning.designpatterns;

public class NavigationStrategyDemo {

	public static void main(String[] args) {

		NavigationContext context = new NavigationContext();

		// Fastest Route
		context.setStrategy(new FastestRoute());
		context.buildRoute("Home → Office");

		// Shortest Route
		context.setStrategy(new ShortestRoute());
		context.buildRoute("Home → Mall");

		// Avoid Tolls
		context.setStrategy(new AvoidTollRoute());
		context.buildRoute("Home → Airport");
	}
}

// 1. Strategy Interface
interface RouteStrategy {
	void calculateRoute(String source);
}

// 2. Concrete Strategies

class FastestRoute implements RouteStrategy {
	public void calculateRoute(String source) {
		System.out.println("Fastest route for: " + source);
	}
}

class ShortestRoute implements RouteStrategy {
	public void calculateRoute(String source) {
		System.out.println("Shortest route for: " + source);
	}
}

class AvoidTollRoute implements RouteStrategy {
	public void calculateRoute(String source) {
		System.out.println("Route avoiding tolls for: " + source);
	}
}

// 3. Context Class

class NavigationContext {

	private RouteStrategy strategy;

	public void setStrategy(RouteStrategy strategy) {
		this.strategy = strategy;
	}

	public void buildRoute(String source) {
		if (strategy == null) {
			System.out.println("No route strategy selected!");
			return;
		}
		strategy.calculateRoute(source);
	}
}