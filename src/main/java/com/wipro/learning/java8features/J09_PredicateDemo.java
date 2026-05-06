package com.wipro.learning.java8features;

import java.util.function.Predicate;

public class J09_PredicateDemo {

	public static void main(String[] args) {

		Predicate<Integer> check = x -> x > 18;

		System.out.println(check.test(25));
	}
}