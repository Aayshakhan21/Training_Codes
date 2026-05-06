package com.wipro.learning.designpatterns;

public class LoggerSingletonDemo {

    public static void main(String[] args) {

        Logger logger1 = Logger.getInstance();
        Logger logger2 = Logger.getInstance();

        logger1.log("Application started");
        logger2.log("User logged in");

        // Check same instance
        System.out.println(logger1 == logger2); // true
    }
}

// Singleton Logger Class
class Logger {

    // Eager initialization (created at class loading)
    private static final Logger instance = new Logger();

    // Private constructor
    private Logger() {
        System.out.println("Logger initialized");
    }

    // Global access point
    public static Logger getInstance() {
        return instance;
    }

    // Logging method
    public void log(String message) {
        System.out.println("[LOG] " + message);
    }
}