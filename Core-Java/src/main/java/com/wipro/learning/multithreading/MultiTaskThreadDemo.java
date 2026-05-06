package com.wipro.learning.multithreading;

public class MultiTaskThreadDemo extends Thread {

    public static void main(String[] args) {

        MultiTaskThreadDemo t1 = new MultiTaskThreadDemo();
        t1.setName("t1");

        MultiTaskThreadDemo t2 = new MultiTaskThreadDemo();
        t2.setName("t2");

        t1.start();
        t2.start();
    }

    void printTable(int num) {
        for (int i = 1; i <= 10; i++) {
            System.out.println(num + " * " + i + " = " + (num * i)
                    + " - " + currentThread().getName());
        }
    }

    void reverseCounting() {
        for (int i = 10; i >= 1; i--) {
            System.out.println(i + " - " + currentThread().getName());
        }
    }

    public void run() {

        if (currentThread().getName().equals("t1")) {
            printTable(3);
        } else if (currentThread().getName().equals("t2")) {
            reverseCounting();
        }
    }
}