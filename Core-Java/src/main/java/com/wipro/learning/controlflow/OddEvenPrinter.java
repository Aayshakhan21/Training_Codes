package com.wipro.learning.controlflow;

public class OddEvenPrinter {

	public static void main(String args[]) {

		// print odd and even from 1 to 100.

		for (int i = 1; i <= 100; i++) // i++ i=i+1
		{
			if (i % 2 == 0)
				System.out.println(i + " : even");
			else
				System.out.println(i + " : odd");
		}

	}

}
