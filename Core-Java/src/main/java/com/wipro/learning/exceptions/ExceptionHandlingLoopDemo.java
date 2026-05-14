package com.wipro.learning.exceptions;

import java.util.InputMismatchException;
import java.util.Scanner;
//import java.util.Scanner;

public class ExceptionHandlingLoopDemo {

    public static void main(String[] args) {

        for (int i = 1; i <= 10; i++) {

            try {
                if (i == 5) {

                    // Example 1: Arithmetic Exception
                    int result = i / 0;

//                     Example 2 (optional): Input mismatch
                     Scanner sc = new Scanner(System.in);
                     int num = sc.nextInt();
                }

            } catch (ArithmeticException e) {
                System.out.println("Arithmetic Error: " + e.getMessage());

            } catch (InputMismatchException e) {
                System.out.println("Invalid Input");

            }

            System.out.println("Value of i: " + i);
//            sc.close();
        }
    }
}