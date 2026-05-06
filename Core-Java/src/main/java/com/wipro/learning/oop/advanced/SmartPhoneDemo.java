package com.wipro.learning.oop.advanced;

interface Camera {
	void takePhoto();
}

interface MusicPlayer {
	void playMusic();
}

class SmartPhone implements Camera, MusicPlayer {

	public void takePhoto() {
		System.out.println("Photo captured");
	}

	public void playMusic() {
		System.out.println("Playing music");
	}
}

public class SmartPhoneDemo {
	public static void main(String[] args) {
		SmartPhone phone = new SmartPhone();
		phone.takePhoto();
		phone.playMusic();
	}
}