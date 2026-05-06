package com.wipro.learning.util;

import java.time.LocalDate;

public class DateTimeAndEnumDemo {

	enum Status {
		ACTIVE, INACTIVE
	}

	public static void main(String[] args) {

		// Date API
		LocalDate today = LocalDate.now();
		System.out.println("Today: " + today);

		// Numeric Wrapper
		Integer num = Integer.valueOf(10);
		System.out.println("Wrapper: " + num);

		// Enum
		Status status = Status.ACTIVE;
		System.out.println("Status: " + status);
	}
}