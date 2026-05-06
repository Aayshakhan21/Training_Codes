package com.wipro.learning.designpatterns;

import java.util.ArrayList;
import java.util.List;

public class ObserverStockMarketDemo {

	// 1. Subscriber Interface
	interface Subscriber {
		void update(String message);
	}

	// 2. Concrete Subscribers (Investors)
	public static class Investor1 implements Subscriber {
		public void update(String message) {
			System.out.println("Investor1 received: " + message);
		}
	}

	public static class Investor2 implements Subscriber {
		public void update(String message) {
			System.out.println("Investor2 received: " + message);
		}
	}

	public static class Investor3 implements Subscriber {
		public void update(String message) {
			System.out.println("Investor3 received: " + message);
		}
	}

	// 3. Subject (Stock Market)
	public static class StockMarket {

		private List<Subscriber> investors = new ArrayList<>();

		// Add investor
		public void subscribe(Subscriber s) {
			investors.add(s);
		}

		// Remove investor
		public void unsubscribe(Subscriber s) {
			investors.remove(s);
		}

		// Notify all investors
		public void notifyInvestors(String update) {
			for (Subscriber s : investors) {
				s.update(update);
			}
		}
	}

	// 4. Main Method
	public static void main(String[] args) {

		StockMarket market = new StockMarket();

		Subscriber i1 = new Investor1();
		Subscriber i2 = new Investor2();
		Subscriber i3 = new Investor3();

		// Subscribe investors
		market.subscribe(i1);
		market.subscribe(i2);
		market.subscribe(i3);

		// Stock update
		market.notifyInvestors("Stock price increased!");

		System.out.println("---- Removing Investor2 ----");

		market.unsubscribe(i2);

		// Another update
		market.notifyInvestors("Stock price dropped!");
	}
}