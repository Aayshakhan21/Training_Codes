package com.wipro.learning.oop.concepts;

public class Rectangle {
	
	/*
	 * 
	 * 6. Problem Statement Work with geometric shapes. Requirements: Class
	 * Rectangle Fields: length, width Constructor initializes values Methods:
	 * calculateArea() calculatePerimeter()
	 * 
	 */

	private double length;
	private double width;

	Rectangle(double length, double width) {
		this.length = length;
		this.width = width;
	}

	double calculateArea() {
		return length * width;
	}

	double calculatePerimeter() {
		return 2 * (length + width);
	}

	public static void main(String[] args) {
		Rectangle r = new Rectangle(5, 3);
		System.out.println(r.calculateArea());
		System.out.println(r.calculatePerimeter());
	}

}