package com.wipro.learning.multithreading;

public class CounterJoinDemo extends Thread {

	static int counter = 0;

	public static void main(String[] args) throws InterruptedException {

		CounterJoinDemo t1 = new CounterJoinDemo();
		t1.setName("incrementThread");

		CounterJoinDemo t2 = new CounterJoinDemo();
		t2.setName("printThread");

		t1.start();
		t1.join(); // wait until increment complete

		t2.start();
		t2.join();
	}

	synchronized void increment() {
		counter++;
	}

	synchronized int getValue() {
		return counter;
	}

	public void run() {

		if (currentThread().getName().equals("incrementThread")) {

			for (int i = 1; i <= 10; i++) {
				increment();
				System.out.println("Counter incremented: " + counter);
			}

		} else if (currentThread().getName().equals("printThread")) {

			for (int i = 1; i <= 10; i++) {
				System.out.println("Counter value: " + getValue());
			}
		}
	}
}