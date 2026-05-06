package com.wipro.learning.exceptions;

public class MultipleCatchDemo {
	public static void main(String[] args) {
		try {
			String s = null;
			System.out.println(s.length()); // NPE
		} catch (ArithmeticException e) {
			System.out.println("Arithmetic issue");
		} catch (NullPointerException e) {
			System.out.println("Null reference");
		} catch (Exception e) { // always last
			System.out.println("Generic exception");
		}
	}
}