package com.wipro.learning.multithreading;

public class TableThreadDemo extends Thread {

    public static void main(String[] args) {

        TableThreadDemo t1 = new TableThreadDemo();
        t1.setName("t1");

        TableThreadDemo t2 = new TableThreadDemo();
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

    public void run() {
        printTable(3);
    }
}