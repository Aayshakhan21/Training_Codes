package com.wipro.learning.designpatterns;

public class NotificationFactoryDemo {

	public static void main(String[] args) {

		Notification n1 = NotificationFactory.getNotification("email");
		n1.send("Hello via Email!");

		Notification n2 = NotificationFactory.getNotification("sms");
		n2.send("Hello via SMS!");

		Notification n3 = NotificationFactory.getNotification("push");
		n3.send("Hello via Push Notification!");
	}
}

// 1. Interface
interface Notification {
	void send(String message);
}

// 2. Concrete Classes

class EmailNotification implements Notification {
	public void send(String message) {
		System.out.println("Email Sent: " + message);
	}
}

class SMSNotification implements Notification {
	public void send(String message) {
		System.out.println("SMS Sent: " + message);
	}
}

class PushNotification implements Notification {
	public void send(String message) {
		System.out.println("Push Notification Sent: " + message);
	}
}

// 3. Factory Class

class NotificationFactory {

	public static Notification getNotification(String type) {

		if (type == null)
			return null;

		if (type.equalsIgnoreCase("email")) {
			return new EmailNotification();
		} else if (type.equalsIgnoreCase("sms")) {
			return new SMSNotification();
		} else if (type.equalsIgnoreCase("push")) {
			return new PushNotification();
		}

		throw new IllegalArgumentException("Invalid notification type");
	}
}