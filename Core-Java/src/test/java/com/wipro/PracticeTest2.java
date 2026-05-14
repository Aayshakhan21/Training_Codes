package com.wipro;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.wipro.learning.basics.TestingClass2;

public class PracticeTest2 {

	@Test
	void testReverseString() {
		assertEquals("olleh", TestingClass2.reverseString("hello"));
	}
 
	@Test
	void testCountVowels() {
		assertEquals(2, TestingClass2.countVowels("hello"));
		assertEquals(5, TestingClass2.countVowels("aeiou"));
	}

	@Test
	void testCountConsonants() {
		assertEquals(3, TestingClass2.countConsonants("hello"));
		assertEquals(0, TestingClass2.countConsonants("aeiou"));
	}

	@Test
	void testCharFrequency() {
		assertEquals(3, TestingClass2.charFrequency("banana", 'a'));
		assertEquals(2, TestingClass2.charFrequency("apple", 'p') - 1 + 1); // safe check
	}

	@Test
	void testUpperCase() {
		assertEquals("HELLO", TestingClass2.toUpperCase("hello"));
	}

	@Test
	void testStringLength() {
		assertEquals(5, TestingClass2.stringLength("hello"));
		assertEquals(0, TestingClass2.stringLength(""));
	}

	@Test
	void testPalindromeString() {
		assertTrue(TestingClass2.isPalindromeString("madam"));
		assertTrue(TestingClass2.isPalindromeString("Madam"));
		assertFalse(TestingClass2.isPalindromeString("hello"));
	}

	@Test
	void testReplaceConsonants() {
		assertEquals("0e00o", TestingClass2.replaceConsonants("hello"));
		assertEquals("aeiou", TestingClass2.replaceConsonants("aeiou"));
	}

}
