package com.wipro.learning.multithreading;

public class WaitNotifyDemo {

	public static void main(String[] args) {

		SharedResource resource = new SharedResource();

		Thread t1 = new Thread(() -> {
			try {
				resource.waitForSignal();
			} catch (InterruptedException e) {
				System.out.println(e);
			}
		});

		Thread t2 = new Thread(() -> {
			try {
				Thread.sleep(2000);
				resource.sendSignal();
			} catch (Exception e) {
				System.out.println(e);
			}
		});

		t1.start();
		t2.start();
	}
}

class SharedResource {

	boolean ready = false;

	synchronized void waitForSignal() throws InterruptedException {

		if (!ready) {
			System.out.println("Thread is waiting...");
			wait(); // waiting state
		}

		System.out.println("Thread resumed and working");
	}

	synchronized void sendSignal() {

		ready = true;

		System.out.println("Sending notification...");
		notify(); // wake one thread
	}
}