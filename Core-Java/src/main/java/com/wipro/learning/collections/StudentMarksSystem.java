package com.wipro.learning.collections;

import java.util.ArrayList;

			//             Student Marks System[ArrayList]
			// Store marks of students and find highest, lowest, and average marks.

public class StudentMarksSystem {

    public static void main(String[] args) {

        // Creating list to store marks
        ArrayList<Integer> marks = new ArrayList<>();

        // Adding marks
        marks.add(85);
        marks.add(60);
        marks.add(90);
        marks.add(70);

        int max = marks.get(0);
        int min = marks.get(0);
        int sum = 0;

        // Loop through list
        for (int m : marks) {
            if (m > max) max = m;
            if (m < min) min = m;
            sum += m;
        }

        double avg = (double) sum / marks.size();

        System.out.println("Marks: " + marks);
        System.out.println("Highest: " + max);
        System.out.println("Lowest: " + min);
        System.out.println("Average: " + avg);
    }
}