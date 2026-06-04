package com.company.dao;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.company.model.Product;
import com.company.util.DBConnection;



public class ProductDao {

    // Add Product
    public void addProduct(Product product) {

        try {
            Connection con = DBConnection.getConnection();

            String sql =
                    "insert into product(name,price) values(?,?)";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setString(1, product.getName());
            ps.setDouble(2, product.getPrice());

            ps.executeUpdate();

            System.out.println("Product Added");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // View All Products
    public void getAllProducts() {

        try {
            Connection con = DBConnection.getConnection();

            String sql = "select * from product";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                System.out.println(
                        rs.getInt("id") + " "
                      + rs.getString("name") + " "
                      + rs.getDouble("price"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Update Product
    public void updateProduct(Product product) {

        try {
            Connection con = DBConnection.getConnection();

            String sql =
                    "update product set name=?, price=? where id=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setString(1, product.getName());
            ps.setDouble(2, product.getPrice());
            ps.setInt(3, product.getId());

            ps.executeUpdate();

            System.out.println("Product Updated");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Delete Product
    public void deleteProduct(int id) {

        try {
            Connection con = DBConnection.getConnection();

            String sql =
                    "delete from product where id=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, id);

            ps.executeUpdate();

            System.out.println("Product Deleted");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}