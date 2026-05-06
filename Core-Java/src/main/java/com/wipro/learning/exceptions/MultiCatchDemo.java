package com.wipro.learning.exceptions;

public class MultiCatchDemo {
	public static void main(String[] args) {
		try {
			String s = null;
//			int a = 10/0;
//			System.out.println(a);
			System.out.println(s.length());
		} catch (NullPointerException e) {
			System.out.println("Handled Null Pointer exceptions");
//		} catch (ArithmeticException e) {
//			System.out.println("Handled Arithmetic exceptions");
		}
	}
}