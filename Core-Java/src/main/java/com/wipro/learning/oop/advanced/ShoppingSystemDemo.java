package com.wipro.learning.oop.advanced;

abstract class Product {
    String name;
    double price;

    Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    abstract double getPrice();
}

interface Discount {
    double applyDiscount();
}

class Electronics extends Product implements Discount {

    Electronics(String name, double price) {
        super(name, price);
    }

    double getPrice() {
        return price;
    }

    public double applyDiscount() {
        return price * 0.90; // 10% discount
    }
}

class Clothing extends Product implements Discount {

    Clothing(String name, double price) {
        super(name, price);
    }

    double getPrice() {
        return price;
    }

    public double applyDiscount() {
        return price * 0.80; // 20% discount
    }
}

public class ShoppingSystemDemo {
    public static void main(String[] args) {

        Electronics e = new Electronics("Laptop", 50000);
        Clothing c = new Clothing("Shirt", 2000);

        System.out.println("Electronics Price after discount: " + e.applyDiscount());
        System.out.println("Clothing Price after discount: " + c.applyDiscount());
    }
}