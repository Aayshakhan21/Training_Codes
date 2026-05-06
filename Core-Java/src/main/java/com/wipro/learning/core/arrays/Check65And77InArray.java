package com.wipro.learning.core.arrays;

public class Check65And77InArray {

    public static void main(String[] args) {

        int[] arr = {10, 65, 20, 77, 30};

        boolean has65 = false;
        boolean has77 = false;

        for (int num : arr) {
            if (num == 65) has65 = true;
            if (num == 77) has77 = true;
        }

        if (has65 && has77)
            System.out.println("Array contains both 65 and 77");
        else
            System.out.println("Not present");
    }
}