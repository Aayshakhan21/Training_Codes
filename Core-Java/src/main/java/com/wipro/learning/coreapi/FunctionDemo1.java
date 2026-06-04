package com.wipro.learning.coreapi;

import java.util.function.Function;

public class FunctionDemo1 {

    public static void main(String[] args) {

        Function<Integer, Integer> func = new Function<Integer, Integer>() {
            public Integer apply(Integer input) {
                return input * input * input;
            }
        };

        System.out.println(func.apply(3));
    }
}