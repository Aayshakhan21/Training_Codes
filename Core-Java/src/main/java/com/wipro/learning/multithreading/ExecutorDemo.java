package com.wipro.learning.multithreading;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ExecutorDemo {

	public static void main(String[] args) {

		// Create thread pool with 3 threads
		ExecutorService executor = Executors.newFixedThreadPool(3);

		// Submit tasks
		executor.execute(() -> {
			for (int i = 1; i <= 5; i++) {
				System.out.println("Task 1 - " + i + " - " + Thread.currentThread().getName());
			}
		});

		executor.execute(() -> {
			for (int i = 1; i <= 5; i++) {
				System.out.println("Task 2 - " + i + " - " + Thread.currentThread().getName());
			}
		});

		executor.execute(() -> {
			for (int i = 1; i <= 5; i++) {
				System.out.println("Task 3 - " + i + " - " + Thread.currentThread().getName());
			}
		});

		// Shutdown executor
		executor.shutdown();
	}
}