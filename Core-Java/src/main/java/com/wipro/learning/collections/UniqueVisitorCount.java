package com.wipro.learning.collections;

import java.util.HashSet;

		//             Unique Visitor Count[HashSet]
		// Count number of unique users visiting a website in a day.

public class UniqueVisitorCount {

	public static void main(String[] args) {

		HashSet<String> visitors = new HashSet<>();

		// Simulating visits
		visitors.add("userA");
		visitors.add("userB");
		visitors.add("userA"); // duplicate visit
		visitors.add("userC");

		System.out.println("Total Unique Visitors: " + visitors.size());
	}
}