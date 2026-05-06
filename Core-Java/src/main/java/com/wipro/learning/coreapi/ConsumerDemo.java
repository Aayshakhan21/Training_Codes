package com.wipro.learning.coreapi;

import java.util.function.Consumer;

public class ConsumerDemo {

	public static void main(String[] args) {

		Consumer<Student> consum = new Consumer<Student>() {
			public void accept(Student x) {
				System.out.println(x);
			}
		};

		Student obj = new Student("Vishal", "67");
		consum.accept(obj);
	}
}