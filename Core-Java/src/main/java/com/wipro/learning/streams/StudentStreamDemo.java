package com.wipro.learning.streams;

import java.util.*;

import com.wipro.learning.collections.Student;

public class StudentStreamDemo {

    public static void main(String[] args) {

        List<Student> students = new ArrayList<>();

        students.add(new Student("Sakshi", 12));
        students.add(new Student("Ram", 22));
        students.add(new Student("Sakshi", 12));
        students.add(new Student("Sneha", 14));

        students.stream()
                .filter(x -> x.getName().contains("S")) // filter names
                .map(x -> x.getName().toUpperCase())    // convert to UpperCase
                .forEach(System.out::println);
    }
}