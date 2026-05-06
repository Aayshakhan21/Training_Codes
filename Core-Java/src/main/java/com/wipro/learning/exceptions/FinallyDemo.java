package com.wipro.learning.exceptions;

public class FinallyDemo {
	public static void main(String[] args) {
		try {
			int[] arr = { 1, 2, 3 };
			System.out.println(arr[5]); // AIOOBE
		} catch (ArrayIndexOutOfBoundsException e) {
			System.out.println("Invalid index");
		} finally {
			System.out.println("Cleanup code runs always");
		}
	}
}