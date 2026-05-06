package com.wipro.learning.java9features;

interface Demo {

    default void show() {
        message();
    }

    static void message() {
        System.out.println("Private method inside interface");
    }
}

public class J906_PrivateInterfaceMethodDemo
        implements Demo {

    public static void main(String[] args) {

        new J906_PrivateInterfaceMethodDemo()
                .show();
    }

	public void message() {
		// TODO Auto-generated method stub
		
	}
}