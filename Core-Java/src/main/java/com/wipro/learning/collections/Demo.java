package com.wipro.learning.collections;

import java.util.ArrayList;
import java.util.List;

public class Demo {

	public static void main(String[] args) {

		List<String> emplist = new ArrayList<String>();

		emplist.add("sakshi");
		emplist.add("Neha");
		emplist.add("Rohit");
		System.out.println(emplist); // [sakshi, Neha, Rohit]

		List list = new ArrayList(); // Object
		list.add(234);
		list.add("sakshi");
		list.add(true);
		list.add(34.5f);
		System.out.println(list); // [234, sakshi, true, 34.5]

		List<String> emplist1 = new ArrayList<String>();

		emplist1.add("Aakshi");
		emplist1.add("Neha");
		emplist1.add("Rohit");
		emplist1.add("Akash");

		for (String element : emplist1) {
			if (element.startsWith("A"))
				System.out.println(element);  // Aakshi Akash
		}

		List<Integer> emplist2 = new ArrayList<Integer>();

		emplist2.add(23);
		emplist2.add(45);
		emplist2.add(33);
		for (int element : emplist2) {

			System.out.println(element); // 23 45 33

		}

	}
}