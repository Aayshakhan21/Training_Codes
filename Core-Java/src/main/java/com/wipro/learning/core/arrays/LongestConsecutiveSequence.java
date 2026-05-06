package com.wipro.learning.core.arrays;

import java.util.HashSet;

public class LongestConsecutiveSequence {

    public static void main(String[] args) {

        int[] arr = {49, 1, 3, 200, 2, 4, 70, 5};

        HashSet<Integer> set = new HashSet<>();
        for (int num : arr) set.add(num);

        int longest = 0;

        for (int num : set) {
            if (!set.contains(num - 1)) { // start of sequence
                int current = num;
                int count = 1;

                while (set.contains(current + 1)) {
                    current++;
                    count++;
                }

                longest = Math.max(longest, count);
            }
        }

        System.out.println("Longest length: " + longest);
    }
}