package com.wipro.learning.core.arrays;

import java.util.HashSet;

public class RemoveDuplicatesFromArray {

    public static void main(String[] args) {

        int[] arr = {20, 20, 30, 40, 50, 50, 50};

        HashSet<Integer> set = new HashSet<>();

        for (int num : arr) {
            set.add(num);
        }

        System.out.println("New length: " + set.size());
    }
}