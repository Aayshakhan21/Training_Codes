package com.wipro.learning.collections;

import java.util.ArrayList;

		//             Recent Searches (Browser)[ArrayList]
		// Store last N search queries and display them in order.

public class RecentSearches {

	public static void main(String[] args) {

		int LIMIT = 5;

		ArrayList<String> searches = new ArrayList<>();

		// Add searches
		searches.add("Java");
		searches.add("Spring Boot");
		searches.add("React");
		searches.add("DSA");
		searches.add("System Design");

		// New search
		String newSearch = "Microservices";

		// If limit reached, remove oldest
		if (searches.size() == LIMIT) {
			searches.remove(0);
		}

		searches.add(newSearch);

		System.out.println("Recent Searches:");
		for (String s : searches) {
			System.out.println(s);
		}
	}
}