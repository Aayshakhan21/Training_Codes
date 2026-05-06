package com.wipro.learning.coreapi;

public class Student {

	String name;
	String rollno;

	public Student(String name, String rollno) {
		this.name = name;
		this.rollno = rollno;
	}

	@Override
	public String toString() {
		return "Student [name=" + name + ", rollno=" + rollno + "]";
	}
}