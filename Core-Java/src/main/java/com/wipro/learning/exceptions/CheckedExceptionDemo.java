package com.wipro.learning.exceptions;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class CheckedExceptionDemo {

	public static void readFile() throws IOException {
		BufferedReader br = new BufferedReader(new FileReader("test.txt"));
		System.out.println(br.readLine());
		br.close();
	}

	public static void main(String[] args) {
		try {
			readFile();
		} catch (IOException e) {
			System.out.println("File not found or read error");
		}
	}
}