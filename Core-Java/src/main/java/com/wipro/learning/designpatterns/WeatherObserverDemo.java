package com.wipro.learning.designpatterns;

import java.util.ArrayList;
import java.util.List;

public class WeatherObserverDemo {

	public static void main(String[] args) {

		// Subject
		WeatherStation station = new WeatherStation();

		// Observers
		Observer mobile = new MobileDisplay();
		Observer web = new WebsiteDisplay();
		Observer led = new LEDDisplay();

		// Subscribe observers
		station.subscribe(mobile);
		station.subscribe(web);
		station.subscribe(led);

		// Weather update
		station.setWeather("Temperature: 30°C");

		System.out.println("---- Removing Website ----");

		station.unsubscribe(web);

		// Another update
		station.setWeather("Temperature: 35°C");
	}
}

// 1. Observer Interface
interface Observer {
	void update(String weatherData);
}

// 2. Concrete Observers

class MobileDisplay implements Observer {
	public void update(String weatherData) {
		System.out.println("Mobile App updated: " + weatherData);
	}
}

class WebsiteDisplay implements Observer {
	public void update(String weatherData) {
		System.out.println("Website updated: " + weatherData);
	}
}

class LEDDisplay implements Observer {
	public void update(String weatherData) {
		System.out.println("LED Display updated: " + weatherData);
	}
}

// 3. Subject (Weather Station)

class WeatherStation {

	private List<Observer> observers = new ArrayList<>();
	private String weatherData;

	// Add observer
	public void subscribe(Observer o) {
		observers.add(o);
	}

	// Remove observer
	public void unsubscribe(Observer o) {
		observers.remove(o);
	}

	// Notify all observers
	public void notifyObservers() {
		for (Observer o : observers) {
			o.update(weatherData);
		}
	}

	// Change state
	public void setWeather(String data) {
		this.weatherData = data;
		notifyObservers(); // auto notify
	}
}