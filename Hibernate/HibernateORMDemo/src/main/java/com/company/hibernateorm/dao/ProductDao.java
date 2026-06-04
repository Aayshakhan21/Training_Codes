package com.company.hibernateorm.dao;

import com.company.hibernateorm.entity.Product;

import java.util.List;

public interface ProductDao {

    void saveProduct(Product product);

    Product getProductById(int id);

    List<Product> getAllProducts();

    void updateProduct(Product product);

    void deleteProduct(int id);
}