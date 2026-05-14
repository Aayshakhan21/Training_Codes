package com.wipro.learning.multithreading;

public class JoinThreadDemo implements Runnable {

	public static void main(String[] args) {

		JoinThreadDemo d1 = new JoinThreadDemo();
		Thread t1 = new Thread(d1);
		t1.setName("t1");

		JoinThreadDemo d2 = new JoinThreadDemo();
		Thread t2 = new Thread(d2);
		t2.setName("t2");

		t1.start();

		try {
			t1.join(); // wait until t1 finishes
		} catch (InterruptedException e) {
			System.out.println(e);
		}

		t2.start();
	}

	public void run() {

		for (int i = 1; i <= 5; i++) {
			System.out.println(i + " - " + Thread.currentThread().getName());
		}
	}
}