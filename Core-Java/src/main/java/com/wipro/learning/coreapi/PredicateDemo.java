package com.wipro.learning.coreapi;

import java.util.function.Predicate;

public class PredicateDemo {

	public static void main(String[] args) {

		Predicate<Integer> pred = new Predicate<Integer>() {
			
			public boolean test(Integer x) {
				return x > 18;
			}
		};

		System.out.println(pred.test(30));
	}
}