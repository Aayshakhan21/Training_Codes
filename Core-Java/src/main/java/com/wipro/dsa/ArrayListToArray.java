package com.wipro.dsa;

import java.util.*;

public class ArrayListToArray {
	public static void main(String[] args) {

		ArrayList<Integer> list = new ArrayList<>();
		list.add(1);
		list.add(2);

		Integer[] arr = list.toArray(new Integer[0]);

		for (int num : arr)
			System.out.print(num + " ");
	}
}