package com.wipro;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.wipro.learning.basics.Addition;
import com.wipro.learning.exceptions.MyException;

public class TestAddition {

	@BeforeAll
	static void show() {
		System.out.println("before all test case working");
	}

	@BeforeEach
	void display() {
		System.out.println("before each test case method is running!");
	}

	@Test
	void test1() {
		Addition obj = new Addition();
		int result = obj.add(3, 5);
		assertEquals(8, result);

	}

	@Test
	void test2() {
		Addition obj = new Addition();
		int result = obj.square(5);
		assertEquals(25, result);

	}

	@Test
	void test3() {
		Addition obj = new Addition();
		String result = obj.getName("ggg");
		assertTrue(result.length() > 2);
	}

	@Test
	void test4() {
		Addition obj = new Addition();
		String result = obj.getName("sakshi vghjlhfiurhfoklerhiferwhjilfjlerijfierjfjerf");
		assertFalse(result.length() < 25);
	}

	@Test
	void test5() {
		int arr1[] = { 1, 2, 3, 4, 5 }; // actual output
		int arr2[] = { 1, 2, 3, 4, 5 }; // expected
		assertArrayEquals(arr2, arr1);
	}

	@Test
	void test6() {
		Addition obj = new Addition();
		assertThrows(MyException.class, () -> obj.throwException());

	}


}
