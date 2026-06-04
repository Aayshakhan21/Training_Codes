package com.wipro.learning.multithreading;

public class RunnableThreadDemo implements Runnable {

    public static void main(String[] args) {

        RunnableThreadDemo obj1 = new RunnableThreadDemo();
        Thread t1 = new Thread(obj1);
        t1.setName("t1");

        RunnableThreadDemo obj2 = new RunnableThreadDemo();
        Thread t2 = new Thread(obj2);
        t2.setName("t2");

        t1.start();
        t2.start();
    }

    void printTable(int num) {
        for (int i = 1; i <= 10; i++) {
            System.out.println(num + " * " + i + " = " + (num * i)
                    + " - " + Thread.currentThread().getName());
        }
    }

    void counting() {
        for (int i = 1; i <= 10; i++) {
            System.out.println(i + " - " + Thread.currentThread().getName());
        }
    }

    public void run() {

        if (Thread.currentThread().getName().equals("t1")) {
            printTable(3);
        } else if (Thread.currentThread().getName().equals("t2")) {
            counting();
        }
    }
}