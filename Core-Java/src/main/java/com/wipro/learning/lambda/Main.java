package com.wipro.learning.lambda;

public class Main {

	public static void main(String[] args) {

		Shape square = (x, y) -> (x * y);

		System.out.println("Area of rectangle: " + square.area(4, 5));

	}

}

interface Shape {
	int area(int x, int y);
}