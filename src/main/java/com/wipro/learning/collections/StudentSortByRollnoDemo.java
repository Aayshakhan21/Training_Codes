package com.wipro.learning.collections;

import java.util.*;

public class StudentSortByRollnoDemo {

	public static void main(String[] args) {

		List<Student> list = new ArrayList<>();

		list.add(new Student("Sakshi", 12));
		list.add(new Student("Ram", 22));
		list.add(new Student("Neha", 13));
		list.add(new Student("Sneha", 14));

		Collections.sort(list, new RollnoComparator());

		System.out.println("Sorted by Roll No:");
		for (Student s : list) {
			System.out.println(s.getName() + " - " + s.getRollno());
		}
	}
}