package com.wipro.learning.multithreading;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ExecutorServiceDemo {

	public static void main(String[] args) {

		// Thread pool with 2 threads
		ExecutorService service = Executors.newFixedThreadPool(2);

		// Submit tasks
		service.submit(() -> System.out.println("Task1: " + Thread.currentThread().getName()));

		service.submit(() -> System.out.println("Task2: " + Thread.currentThread().getName()));

		service.submit(() -> System.out.println("Task3: " + Thread.currentThread().getName()));

		// Shutdown thread pool
		service.shutdown();
	}
}