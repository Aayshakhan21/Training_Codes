package com.wipro;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.wipro.learning.basics.Addition;

public class TestStudent {
	
	
	@Test
	void test1() {
		Addition obj = new Addition();
		int result = obj.add(10, 15);
		assertEquals(25, result);

	}

	@Test
	void test2() {
		Addition obj = new Addition();
		int result = obj.square(7);
		assertEquals(49, result);

	}

	@Test
	void test3() {
		Addition obj = new Addition();
		String result = obj.getName("kkk");
		assertTrue(result.length() > 2);
	}

	@Test
	void test4() {
		Addition obj = new Addition();
		String result = obj.getName("vishal vghjlhfiurhfoklerhiferwhjilfjlerijfierjfjerf");
		assertFalse(result.length() < 25);
	}
	
	

}
