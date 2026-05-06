package com.wipro.learning.multithreading;

public class ThreadGroupDemo {

	public static void main(String[] args) {

		ThreadGroup group1 = new ThreadGroup("Group1");
		ThreadGroup group2 = new ThreadGroup("Group2");

		Thread t1 = new Thread(group1,
				() -> System.out.println("Thread1 running in " + Thread.currentThread().getThreadGroup().getName()));

		Thread t2 = new Thread(group1,
				() -> System.out.println("Thread2 running in " + Thread.currentThread().getThreadGroup().getName()));

		Thread t3 = new Thread(group2,
				() -> System.out.println("Thread3 running in " + Thread.currentThread().getThreadGroup().getName()));

		Thread t4 = new Thread(group2,
				() -> System.out.println("Thread4 running in " + Thread.currentThread().getThreadGroup().getName()));

		t1.setPriority(Thread.MAX_PRIORITY);

		t1.start();
		t2.start();
		t3.start();
		t4.start();
	}
}