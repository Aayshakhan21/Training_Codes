/*

package com.wipro.learning.modernjava;

// Virtual threads allow massive concurrency with low memory cost.

public class VirtualThreadDemo {

    public static void main(String[] args) {

        // Create and start virtual thread
        Thread virtualThread =
                Thread.startVirtualThread(() -> {

                    System.out.println(
                        "Running in: "
                        + Thread.currentThread()
                    );

                    for (int i = 1; i <= 5; i++) {
                        System.out.println("Task " + i);
                    }
                });

        // Wait for completion
        try {
            virtualThread.join();
        } catch (InterruptedException e) {
            System.out.println(e);
        }

        System.out.println("Main thread finished");
    }
}

*/