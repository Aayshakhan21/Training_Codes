package com.wipro.learning.designpatterns;

public class BuilderDemo {

	public static void main(String[] args) {

		Mobile m = new Mobile.Builder()
				.setBrand("Samsung")
				.setRam(8)
				.setBattery(5000)
				.build();

		m.show();
	}
}

// Product Class
class Mobile {

	String brand;
	int ram;
	int battery;

	// Private constructor
	private Mobile(Builder obj) {
		this.brand = obj.brand;
		this.ram = obj.ram;
		this.battery = obj.battery;
	}

	void show() {
		System.out.println("Brand: " + brand);
		System.out.println("RAM: " + ram);
		System.out.println("Battery: " + battery);
	}

	// Static Builder Class
	public static class Builder {

		String brand;
		int ram;
		int battery;

		public Builder setBrand(String brand) {
			this.brand = brand;
			return this;
		}

		public Builder setRam(int ram) {
			this.ram = ram;
			return this;
		}

		public Builder setBattery(int battery) {
			this.battery = battery;
			return this;
		}

		public Mobile build() {
			return new Mobile(this);
		}
	}
}