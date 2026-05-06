package com.wipro.learning.oop.concepts;

public class Book {

	/*
	 * 
	 * 5. Manage books in a library. Requirements: Class Book Fields: title, author,
	 * isIssued Constructor initializes values Methods: issueBook() returnBook()
	 * displayStatus()
	 * 
	 */

	private String title;
	private String author;
	private boolean isIssued;

	Book(String title, String author) {
		this.title = title;
		this.setAuthor(author);
		this.isIssued = false;
	}
	
	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	void issueBook() {
		isIssued = true;
	}

	void returnBook() {
		isIssued = false;
	}

	void displayStatus() {
		System.out.println(title + " " + (isIssued ? "Issued" : "Available"));
	}

	public static void main(String[] args) {
		Book b = new Book("Java", "James Goslin");
		b.displayStatus();
		b.issueBook();
		b.displayStatus();
	}

}