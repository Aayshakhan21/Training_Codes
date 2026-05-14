package com.wipro.learning.collections;

import java.util.Objects;

public class Student implements Comparable<Student> {

	private String name;
	private int rollno;

	public Student(String name, int rollno) {
		this.name = name;
		this.rollno = rollno;
	}

	public String getName() {
		return name;
	}

	public int getRollno() {
		return rollno;
	}

	@Override
	public String toString() {
		return "Student{name='" + name + "', rollno=" + rollno + "}";
	}

	// Default sorting → by name
	@Override
	public int compareTo(Student other) {
		return this.name.compareToIgnoreCase(other.name);
	}

	// Required for HashSet (duplicate handling)
	@Override
	public int hashCode() {
		return Objects.hash(name, rollno);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null || getClass() != obj.getClass())
			return false;

		Student other = (Student) obj;
		return rollno == other.rollno && Objects.equals(name, other.name);
	}
}