package com.wipro.learning.multithreading;

public class CountingThreadDemo extends Thread {

    public static void main(String[] args) {

        CountingThreadDemo t1 = new CountingThreadDemo();
        t1.setName("reverseThread");

        CountingThreadDemo t2 = new CountingThreadDemo();
        t2.setName("countThread");

        t1.start();
        t2.start();
    }

    void reverseCounting() {
        for (int i = 10; i >= 1; i--) {
            System.out.println(i + " - " + currentThread().getName());
        }
    }

    void counting() {
        for (int i = 1; i <= 10; i++) {
            System.out.println(i + " - " + currentThread().getName());
        }
    }

    public void run() {

        if (currentThread().getName().equals("reverseThread")) {
            reverseCounting();
        } else {
            counting();
        }
    }
}