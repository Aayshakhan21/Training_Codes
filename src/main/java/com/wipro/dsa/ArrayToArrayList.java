package com.wipro.dsa;

import java.util.*;

public class ArrayToArrayList {
	public static void main(String[] args) {

		Integer[] arr = { 1, 2, 3 };

		ArrayList<Integer> list = new ArrayList<>(Arrays.asList(arr));

		System.out.println(list);
	}
}