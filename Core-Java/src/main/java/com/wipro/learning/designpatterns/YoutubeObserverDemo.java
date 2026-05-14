package com.wipro.learning.designpatterns;

public class YoutubeObserverDemo {

	public static void main(String[] args) {

		Subscriber user1 = new Users("Sakshi");
		Subscriber user2 = new Users("Prashant");

		Subscriber[] users = { user1, user2 };

		YoutubeChannel channel = new YoutubeChannel(users);

		channel.notifyUsers("New video uploaded!");
	}
}

// Observer Interface
interface Subscriber {
	void update(String message);
}

// Concrete Observer
class Users implements Subscriber {

	private String name;

	public Users(String name) {
		this.name = name;
	}

	public void update(String message) {
		System.out.println(name + " received: " + message);
	}
}

// Subject
class YoutubeChannel {

	private Subscriber[] users;

	public YoutubeChannel(Subscriber[] users) {
		this.users = users;
	}

	public void notifyUsers(String message) {

		for (Subscriber user : users) {
			user.update(message);
		}
	}
}