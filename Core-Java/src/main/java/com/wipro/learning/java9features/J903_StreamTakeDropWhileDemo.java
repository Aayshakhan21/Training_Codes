package com.wipro.learning.java9features;

import java.util.List;

public class J903_StreamTakeDropWhileDemo {

	public static void main(String[] args) {

		List<Integer> list = List.of(1, 2, 3, 4, 5, 1, 2);

		System.out.println("takeWhile:");
		list.stream().takeWhile(x -> x < 5).forEach(System.out::println);

		System.out.println("dropWhile:");
		list.stream().dropWhile(x -> x < 5).forEach(System.out::println);
	}
}