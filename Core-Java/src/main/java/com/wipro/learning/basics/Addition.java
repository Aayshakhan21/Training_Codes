package com.wipro.learning.basics;

import com.wipro.learning.exceptions.MyException;

public class Addition {

	void display() {
		System.out.println("Welcome");
	}

	public int square(int x) {
		return x * x;
	}
	
	public int add(int x, int y) {
		return x + y;
	}

	public String getName(String name) {
		return name;
	}

	public void throwException() throws MyException {
		throw new MyException("This is Custom exception message");
	}
	
	
	
	
	
	
	
	
	
	
	
	

}
