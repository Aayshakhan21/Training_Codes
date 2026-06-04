package com.wipro.learning.exceptions;

public class UncheckedExceptionDemo {
    public static void main(String[] args) {
        int[] arr = new int[2];
        arr[5] = 10; // ArrayIndexOutOfBoundsException
    }
}