package com.company.hibernateorm;
import com.company.hibernateorm.dao.ProductDaoImpl;
import com.company.hibernateorm.entity.Category;
import com.company.hibernateorm.entity.Product;
import com.company.hibernateorm.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class App {

    public static void main(String[] args) {

        // Save Categories First
        Session session =
                HibernateUtil.getSessionFactory()
                        .openSession();

        Transaction tx =
                session.beginTransaction();

        Category category1 =
                new Category("Electronics");

        Category category2 =
                new Category("Stationary");

        session.persist(category1);
        session.persist(category2);

        tx.commit();
        session.close();

        // DAO Object
        ProductDaoImpl dao = new ProductDaoImpl();

        // Products
        Product product1 =
                new Product(
                        "Laptop",
                        50000,
                        category1
                );

        Product product2 =
                new Product(
                        "Tablet",
                        30000,
                        category1
                );

        Product product3 =
                new Product(
                        "Pen",
                        20,
                        category2
                );

        Product product4 =
                new Product(
                        "Notebook",
                        100,
                        category2
                );

        // Save Products
        dao.saveProduct(product1);
        dao.saveProduct(product2);
        dao.saveProduct(product3);
        dao.saveProduct(product4);

        /*
            HQL Query
         */
        System.out.println("\nHQL Based Query");

        List<Product> allProducts =
                dao.getAllProducts();

        for (Product product : allProducts) {

            System.out.println(
                    product.getId() + " "
                            + product.getName() + " "
                            + product.getPrice()
            );
        }

        /*
            Criteria Query
         */
        System.out.println(
                "\nCriteria Based Query"
        );

        List<Product> betweenProducts =
                dao.getBetweenPrice(100, 50000);

        for (Product product : betweenProducts) {

            System.out.println(
                    product.getName() + " "
                            + product.getPrice()
            );
        }

        /*
            Native SQL Query
         */
        System.out.println(
                "\nNative SQL Query"
        );

        List<Object[]> products =
                dao.findAll();

        for (Object[] row : products) {

            System.out.println(
                    row[0] + " "
                            + row[1] + " "
                            + row[2] + " "
                            + row[3]
            );
        }
    }
}