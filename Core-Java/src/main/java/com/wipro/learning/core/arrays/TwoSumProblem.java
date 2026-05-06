package com.wipro.learning.core.arrays;

import java.util.HashSet;

public class TwoSumProblem {

    public static void main(String[] args) {

        int[] arr = {1, 2, 4, 5, 6};
        int target = 6;

        HashSet<Integer> set = new HashSet<>();

        for (int num : arr) {
            int complement = target - num;

            if (set.contains(complement)) {
                System.out.println("Pair: " + num + ", " + complement);
                return;
            }
            set.add(num);
        }

        System.out.println("No pair found");
    }
}