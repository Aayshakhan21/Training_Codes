package com.company.service;

import com.company.dao.ProductDao;
import com.company.model.Product;

public class ProductService {

    ProductDao dao = new ProductDao();

    public void addProduct(Product product) {
        dao.addProduct(product);
    }

    public void viewProducts() {
        dao.getAllProducts();
    }
}