package com.wipro.learning.designpatterns;

public class AdapterBooking2Demo {

    public static void main(String[] args) {

        // Existing system
        Zomato zomato = new Zomato();
        zomato.placeOrder("Pizza");

        // New feature via adapter
        FoodApp app = new BookingAdapter(new TableBookingSystem());
        app.book("Vishal");
    }
}

	// Target Interface (what client expects)
	interface FoodApp {
	    void book(String name);
	}
	
	// Existing feature
	class Zomato {
	    public void placeOrder(String item) {
	        System.out.println("Order placed: " + item);
	    }
	}
	
	// New system (incompatible)
	class TableBookingSystem {
	    public void bookTable(String name) {
	        System.out.println("Table booked for: " + name);
	    }
	}
	
	// Adapter
	class BookingAdapter implements FoodApp {
	
	    private TableBookingSystem booking;
	
	    public BookingAdapter(TableBookingSystem booking) {
	        this.booking = booking;
	    }
	
	    @Override
	    public void book(String name) {
	        System.out.println("Using adapter to book table...");
	        booking.bookTable(name);
	    }
	}