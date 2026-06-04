package com.wipro.learning.exceptions;

import java.util.InputMismatchException;
import java.util.Scanner;

// Custom Exception 1: Invalid Marks
class InvalidMarksException extends Exception {
    public InvalidMarksException(String message) {
        super(message);
    }
}

// Custom Exception 2: Fail Condition
class FailException extends Exception {
    public FailException(String message) {
        super(message);
    }
}

public class StudentResultSystem {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        try {
            System.out.print("Enter marks for Subject 1: ");
            int m1 = sc.nextInt();

            System.out.print("Enter marks for Subject 2: ");
            int m2 = sc.nextInt();

            System.out.print("Enter marks for Subject 3: ");
            int m3 = sc.nextInt();

            // Validate marks
            validateMarks(m1, m2, m3);

            int total = m1 + m2 + m3;
            double avg = total / 3.0;

            System.out.println("\nTotal: " + total);
            System.out.println("Average: " + avg);

            // Check result
            checkResult(m1, m2, m3);

            System.out.println("Result: PASS");

        } catch (InputMismatchException e) {
            System.out.println("Invalid input! Enter numbers only.");

        } catch (InvalidMarksException e) {
            System.out.println("Invalid Marks Error: " + e.getMessage());

        } catch (FailException e) {
            System.out.println("Result: FAIL → " + e.getMessage());

        } catch (Exception e) {
            System.out.println("Unexpected error occurred.");

        } finally {
            sc.close();
            System.out.println("\nProgram ended.");
        }
    }

    // Method to validate marks
    static void validateMarks(int m1, int m2, int m3) throws InvalidMarksException {
        if (m1 < 0 || m2 < 0 || m3 < 0 || m1 > 100 || m2 > 100 || m3 > 100) {
            throw new InvalidMarksException("Marks must be between 0 and 100");
        }
    }

    // Method to check pass/fail
    static void checkResult(int m1, int m2, int m3) throws FailException {
        if (m1 < 33 || m2 < 33 || m3 < 33) {
            throw new FailException("One or more subjects below passing marks (33)");
        }
    }
}