package com.wipro.dsa;

import java.util.PriorityQueue;

// Find the kth largest element in an unsorted array. It is the kth largest element in sorted order, not the kth distinct element.

public class KthLargestElement {

	public static void main(String[] args) {

		int[] arr = { 3, 2, 1, 5, 6, 4 };
		int k = 2;

		PriorityQueue<Integer> pq = new PriorityQueue<>();

		for (int num : arr) {
			pq.add(num);
			if (pq.size() > k) {
				pq.poll();
			}
		}

		System.out.println("Kth Largest: " + pq.peek());
	}
}