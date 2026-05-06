package com.wipro.learning.controlflow;

import java.util.*;

public class DoWhileLoopDemo {

	public static void main(String args[]) {
		boolean choice = false;
		Scanner obj = new Scanner(System.in);

		// Explaining how do while loop works

		do {
			System.out.println("do block is working! " + choice);
			// user input
			choice = obj.nextBoolean();
		} while (choice);
		System.out.println("thankyou!");

		obj.close();
	}

}
