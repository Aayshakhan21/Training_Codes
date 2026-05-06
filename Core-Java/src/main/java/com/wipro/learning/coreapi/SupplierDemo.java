package com.wipro.learning.coreapi;

import java.util.function.Supplier;

public class SupplierDemo {

	public static void main(String[] args) {

		Supplier<Student> s = new Supplier<Student>() {
			public Student get() {
				return new Student("Sakshi", "12");
			}
		};

		System.out.println(s.get());
	}
}