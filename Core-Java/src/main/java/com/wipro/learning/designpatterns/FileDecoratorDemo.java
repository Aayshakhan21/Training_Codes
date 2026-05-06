package com.wipro.learning.designpatterns;

public class FileDecoratorDemo {

	public static void main(String[] args) {

		File file = new SimpleFile();

		// Add features dynamically
		file = new CompressionDecorator(file);
		file = new EncryptionDecorator(file);
		file = new LoggingDecorator(file);

		file.process();
	}
}

// 1. Component Interface
interface File {
	void process();
}

// 2. Concrete Component
class SimpleFile implements File {

	public void process() {
		System.out.println("Basic file processing");
	}
}

// 3. Base Decorator
abstract class FileDecorator implements File {

	protected File file;

	public FileDecorator(File file) {
		this.file = file;
	}
}

// 4. Concrete Decorators

class CompressionDecorator extends FileDecorator {

	public CompressionDecorator(File file) {
		super(file);
	}

	public void process() {
		file.process();
		System.out.println("Adding Compression...");
	}
}

class EncryptionDecorator extends FileDecorator {

	public EncryptionDecorator(File file) {
		super(file);
	}

	public void process() {
		file.process();
		System.out.println("Adding Encryption...");
	}
}

class LoggingDecorator extends FileDecorator {

	public LoggingDecorator(File file) {
		super(file);
	}

	public void process() {
		file.process();
		System.out.println("Adding Logging...");
	}
}