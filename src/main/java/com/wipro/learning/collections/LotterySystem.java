package com.wipro.learning.collections;

import java.util.HashSet;

      	//             Lottery System[HashSet]
		// Store unique ticket numbers and reject duplicates.

public class LotterySystem {

	public static void main(String[] args) {

		HashSet<Integer> tickets = new HashSet<>();

		int[] inputTickets = { 101, 102, 103, 101, 104 };

		for (int ticket : inputTickets) {

			if (!tickets.add(ticket)) {
				System.out.println("Duplicate ticket rejected: " + ticket);
			} else {
				System.out.println("Ticket accepted: " + ticket);
			}
		}

		System.out.println("\nFinal Tickets: " + tickets);
	}
}