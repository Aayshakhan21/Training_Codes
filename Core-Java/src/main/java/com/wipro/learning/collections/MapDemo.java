package com.wipro.learning.collections;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

public class MapDemo {

	public static void main(String[] args) {

		Map<Integer, String> setData = new HashMap();

		setData.put(1, "java");
		setData.put(2, "python");
		setData.put(3, "C++");
		setData.put(4, "react");

		System.out.println(setData + "\n");

		Map<Integer, String> map = new HashMap();

		map.put(1, "java");
		map.put(2, "python");
		map.put(3, "C++");
		map.put(4, "react");

		for (Entry<Integer, String> obj : map.entrySet()) {
			System.out.print(obj.getKey() + " : ");
			System.out.println(obj.getValue() + "\n________________");
		}
	}

}