package com.wipro.learning.designpatterns;

public class SortStrategyDemo {

    public static void main(String[] args) {

        SortContext context = new SortContext();

        // Use Bubble Sort
        context.setStrategy(new BubbleSort());
        context.sort();

        // Switch to Quick Sort
        context.setStrategy(new QuickSort());
        context.sort();
    }
}

	// 1. Strategy Interface
	interface SortStrategy {
	    void sort();
	}
	
	// 2. Concrete Strategies
	
	class BubbleSort implements SortStrategy {
	    public void sort() {
	        System.out.println("Sorting using Bubble Sort...");
	    }
	}
	
	class QuickSort implements SortStrategy {
	    public void sort() {
	        System.out.println("Sorting using Quick Sort...");
	    }
	}
	
	// 3. Context Class
	class SortContext {
	
	    private SortStrategy strategy;
	
	    public void setStrategy(SortStrategy strategy) {
	        this.strategy = strategy;
	    }
	
	    public void sort() {
	        if (strategy == null) {
	            System.out.println("No sorting strategy selected!");
	            return;
	        }
	        strategy.sort();
	    }
}