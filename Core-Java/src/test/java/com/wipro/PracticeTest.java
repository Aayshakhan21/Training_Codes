package com.wipro;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.wipro.learning.basics.TestingClass;

public class PracticeTest {

    // 🔹 Prime Number Tests
    @Test
    void testPrime() {
        assertTrue(TestingClass.isPrime(7));
        assertTrue(TestingClass.isPrime(2));
        assertFalse(TestingClass.isPrime(10));
        assertFalse(TestingClass.isPrime(1));
        assertFalse(TestingClass.isPrime(0));
    }

    // Reverse Array Tests 
    @Test
    void testReverseArray() {
        int[] input = {1, 2, 3, 4};
        int[] expected = {4, 3, 2, 1};

        assertArrayEquals(expected, TestingClass.reverse(input));
    }

    // Max Min Tests
    @Test
    void testMaxMin() {
        int[] input = {5, 2, 9, 1};

        int[] result = TestingClass.findMaxMin(input);

        assertEquals(9, result[0]); // max
        assertEquals(1, result[1]); // min
    }

    // Palindrome Tests
    @Test
    void testPalindrome() {
        assertTrue(TestingClass.isPalindrome(121));
        assertTrue(TestingClass.isPalindrome(7));
        assertFalse(TestingClass.isPalindrome(123));
        assertFalse(TestingClass.isPalindrome(10));
    }

    // Vowel / Consonant Tests
    @Test
    void testVowelConsonant() {
        assertEquals("Vowel", TestingClass.check('a'));
        assertEquals("Vowel", TestingClass.check('E'));
        assertEquals("Consonant", TestingClass.check('z'));
        assertEquals("Consonant", TestingClass.check('b'));
    }

    // Odd / Even Tests
    @Test
    void testOddEven() {
        assertEquals("Even", TestingClass.check(10));
        assertEquals("Odd", TestingClass.check(7));
        assertEquals("Even", TestingClass.check(0));
        assertEquals("Odd", TestingClass.check(-3));
    }
}