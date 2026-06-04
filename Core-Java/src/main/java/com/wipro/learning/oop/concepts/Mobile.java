package com.wipro.learning.oop.concepts;

public class Mobile {

	/*
	 * 
	 * 4. Problem Statement Simulate a mobile phone. Requirements: Class Mobile
	 * Fields: brand, batteryLevel Constructor initializes values Methods:
	 * makeCall() chargeBattery() checkBattery()
	 * 
	 */
	private String brand;
	private int batteryLevel;

	Mobile(String brand, int batteryLevel) {
		this.batteryLevel = batteryLevel;
	}

	void makeCall() {
		if (batteryLevel > 0) {
			batteryLevel -= 10;
			System.out.println("Calling");
		} else {
			System.out.println("Battery low");
		}
	}

	void chargeBattery() {
		batteryLevel = 100;
	}

	void checkBattery() {
		System.out.println(batteryLevel);
	}

	public static void main(String[] args) {
		Mobile m = new Mobile("Samsung", 50);
		m.makeCall();
		m.checkBattery();
	}

	public String getBrand() {
		return brand;
	}

}