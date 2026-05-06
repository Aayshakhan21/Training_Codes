package com.wipro.learning.exceptions;

public class NestedTryCatchDemo {
    public static void main(String[] args) {

        try {
            int[] arr = {1,2};
            try {
                System.out.println(arr[5]); // inner
            } catch (ArrayIndexOutOfBoundsException e) {
                System.out.println("Inner catch: invalid index");
            }

            int x = 10 / 0; // outer
        } catch (ArithmeticException e) {
            System.out.println("Outer catch: divide by zero");
        }
    }
}