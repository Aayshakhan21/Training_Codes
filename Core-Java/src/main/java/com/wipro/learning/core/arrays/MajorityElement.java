package com.wipro.learning.core.arrays;

public class MajorityElement {

    public static void main(String[] args) {

        int[] arr = {2, 2, 1, 2, 3, 2, 2};

        int candidate = 0, count = 0;

        // Boyer-Moore Voting Algorithm
        for (int num : arr) {
            if (count == 0) {
                candidate = num;
            }
            count += (num == candidate) ? 1 : -1;
        }

        System.out.println("Majority Element: " + candidate);
    }
}