package com.wipro.learning.exceptions;

public class DatabaseConnectionDemo implements AutoCloseable {

	public void connect() {
		System.out.println("Connecting to the database...");
	}

	@Override
	public void close() {
		System.out.println("Closing the database connection...");
	}

	public static void main(String[] args) {

		try (DatabaseConnectionDemo db = new DatabaseConnectionDemo()) {
			db.connect();
			System.out.println("Performing database operations...");
		} catch (Exception e) {
			System.out.println("Error: " + e.getMessage());
		}
	}
}