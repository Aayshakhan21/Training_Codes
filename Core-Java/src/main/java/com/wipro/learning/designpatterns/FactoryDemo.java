package com.wipro.learning.designpatterns;

public class FactoryDemo {

	public static void main(String[] args) {

		// Client does NOT create objects directly
		Shape s1 = ShapeFactory.getShape("circle");
		s1.draw();

		Shape s2 = ShapeFactory.getShape("rectangle");
		s2.draw();

		Shape s3 = ShapeFactory.getShape("triangle");
		if (s3 != null) {
			s3.draw();
		}
	}
}

// 1. Product Interface
interface Shape {
	void draw();
}

// 2. Concrete Products
class Circle implements Shape {
	public void draw() {
		System.out.println("Drawing Circle");
	}
}

class Rectangle implements Shape {
	public void draw() {
		System.out.println("Drawing Rectangle");
	}
}

class Triangle implements Shape {
	public void draw() {
		System.out.println("Drawing Triangle");
	}
}

// 3. Factory Class
class ShapeFactory {

	public static Shape getShape(String type) {

		if (type == null)
			return null;

		if (type.equalsIgnoreCase("circle")) {
			return new Circle();
		} else if (type.equalsIgnoreCase("rectangle")) {
			return new Rectangle();
		} else if (type.equalsIgnoreCase("triangle")) {
			return new Triangle();
		}

		System.out.println("Invalid shape type");
		return null;
	}
}