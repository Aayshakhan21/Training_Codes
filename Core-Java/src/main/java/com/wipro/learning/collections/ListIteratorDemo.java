package com.wipro.learning.collections;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

public class ListIteratorDemo {

	public static void main(String[] args) {

		List<String> emplist = new ArrayList<String>();

		emplist.add("Aakshi");
		emplist.add("Neha");
		emplist.add("Rohit");
		emplist.add("Akash");

		ListIterator<String> empItr = emplist.listIterator();

		// Traversing elements using next() method
		while (empItr.hasNext()) {
			System.out.println(empItr.next());
		}
		// Print elements in reverse order
		while (empItr.hasPrevious()) {
			System.out.println(empItr.previous());
		}
	}
}