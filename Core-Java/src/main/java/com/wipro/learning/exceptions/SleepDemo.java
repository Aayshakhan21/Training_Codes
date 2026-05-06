package com.wipro.learning.exceptions;

public class SleepDemo {
	public static void main(String[] args) throws InterruptedException {
		for (int i = 0; i < 3; i++) {
			System.out.print(i + " ");
			Thread.sleep(2000);
		}
	}
}