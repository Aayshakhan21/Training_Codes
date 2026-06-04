package com.wipro.learning.coreapi;

import java.util.Optional;
import java.util.StringJoiner;

public class StringAndOptionalDemo {

	public static void main(String[] args) {

		// String (immutable)
		String str = "Java";
		System.out.println(str.toUpperCase());

		// StringBuilder (mutable)
		StringBuilder sb = new StringBuilder("Hello");
		sb.append(" World");
		System.out.println(sb);

		// StringJoiner
		StringJoiner sj = new StringJoiner(", ");
		sj.add("A").add("B").add("C");
		System.out.println(sj);

		// Optional
		Optional<String> name = Optional.ofNullable(null);
		System.out.println(name.orElse("Default Name"));
	}
}