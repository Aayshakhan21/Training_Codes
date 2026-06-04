package com.wipro.learning.designpatterns;

	public class ObserverDemo {
	
		public static void main(String[] args) {
	
			Subscribers u1 = new User1("Vishy");
			Subscribers u2 = new User1("Rahul");
			Subscribers u3 = new User1("Aman");
	
			Subscribers[] users = { u1, u2, u3 };
	
			YoutubeApp app = new YoutubeApp(users);
	
			app.notifyUser("New video uploaded!");
		}
	}
	
	// Observer
	interface Subscribers {
		void updates(String message);
	}
	
	// Concrete Observer
	class User1 implements Subscribers {
	
		String name;
	
		public User1(String name) {
			this.name = name;
		}
	
		public void updates(String message) {
			System.out.println(name + " -> " + message);
		}
	}
	
	// Subject
	class YoutubeApp {
	
		Subscribers[] users;
	
		public YoutubeApp(Subscribers[] users) {
			this.users = users;
		}
	
		public void notifyUser(String msg) {
			for (Subscribers user : users) {
				user.updates(msg);
			}
		}
	}