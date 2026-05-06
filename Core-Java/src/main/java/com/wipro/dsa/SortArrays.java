package com.wipro.dsa;

import java.util.Arrays;

public class SortArrays {
    public static void main(String[] args) {

        int[] nums = {5, 2, 9, 1};
        String[] names = {"Zara", "Aman", "Ravi"};

        Arrays.sort(nums);
        Arrays.sort(names);

        System.out.println(Arrays.toString(nums));
        System.out.println(Arrays.toString(names));
    }
}