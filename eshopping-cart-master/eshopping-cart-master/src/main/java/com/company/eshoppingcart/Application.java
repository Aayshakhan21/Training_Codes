package com.company.eshoppingcart;

import java.util.Scanner;

import com.company.dao.ProductDao;
import com.company.model.Product;

public class Application {

    public static void main(String[] args) {

        ProductDao dao = new ProductDao();
        Scanner sc = new Scanner(System.in);

        while (true) {

            System.out.println("\n1. Add Product");
            System.out.println("2. View Products");
            System.out.println("3. Update Product");
            System.out.println("4. Delete Product");
            System.out.println("5. Exit");

            int choice = sc.nextInt();

            switch (choice) {

            case 1:
                System.out.println("Enter Name:");
                String name = sc.next();

                System.out.println("Enter Price:");
                double price = sc.nextDouble();

                dao.addProduct(
                        new Product(name, price));
                break;

            case 2:
                dao.getAllProducts();
                break;

            case 3:
                System.out.println("Enter Id:");
                int id = sc.nextInt();

                System.out.println("Enter Name:");
                String newName = sc.next();

                System.out.println("Enter Price:");
                double newPrice = sc.nextDouble();

                dao.updateProduct(
                        new Product(id, newName, newPrice));
                break;

            case 4:
                System.out.println("Enter Id:");
                int deleteId = sc.nextInt();

                dao.deleteProduct(deleteId);
                break;

            case 5:
                System.out.println("Thank You");
                System.exit(0);

            default:
                System.out.println("Invalid Choice");
            }
        }
    }
}