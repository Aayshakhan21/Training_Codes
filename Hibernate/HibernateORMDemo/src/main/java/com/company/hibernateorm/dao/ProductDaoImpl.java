package com.company.hibernateorm.dao;

import com.company.hibernateorm.entity.Product;
import com.company.hibernateorm.util.HibernateUtil;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class ProductDaoImpl {

    // Save Product
    public void saveProduct(Product product) {

        Transaction transaction = null;

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            transaction = session.beginTransaction();

            session.persist(product);

            transaction.commit();

            System.out.println("Product Saved Successfully");

        } catch (Exception e) {

            System.out.println(e.getMessage());

            if (transaction != null
                    && transaction.getStatus().canRollback()) {

                transaction.rollback();
            }
        }
    }

    // Get Product By Id
    public Product getProductById(int id) {

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            return session.get(Product.class, id);
        }
    }

    /*
        HQL Based Query
     */
    public List<Product> getAllProducts() {

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            String hql = "from Product";

            return session
                    .createQuery(hql, Product.class)
                    .list();
        }
    }

    /*
        HQL Query With Condition
     */
    public List<Product> getProductsGreaterThanPrice(double price) {

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            String hql =
                    "from Product where price > :price";

            return session
                    .createQuery(hql, Product.class)
                    .setParameter("price", price)
                    .list();
        }
    }

    /*
        Criteria Based Query
     */
    public List<Product> getBetweenPrice(
            double minPrice,
            double maxPrice
    ) {

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            CriteriaBuilder cb =
                    session.getCriteriaBuilder();

            CriteriaQuery<Product> cq =
                    cb.createQuery(Product.class);

            Root<Product> root =
                    cq.from(Product.class);

            cq.where(
                    cb.between(
                            root.get("price"),
                            minPrice,
                            maxPrice
                    )
            );

            return session
                    .createQuery(cq)
                    .getResultList();
        }
    }

    /*
        Native SQL Query
     */
    public List<Object[]> findAll() {

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            String sql = "select * from products";

            return session
                    .createNativeQuery(sql)
                    .list();
        }
    }

    // Update Product
    public void updateProduct(Product product) {

        Transaction transaction = null;

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            transaction = session.beginTransaction();

            session.merge(product);

            transaction.commit();

            System.out.println("Product Updated Successfully");

        } catch (Exception e) {

            if (transaction != null
                    && transaction.getStatus().canRollback()) {

                transaction.rollback();
            }

            e.printStackTrace();
        }
    }

    // Delete Product
    public void deleteProduct(int id) {

        Transaction transaction = null;

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            transaction = session.beginTransaction();

            Product product =
                    session.get(Product.class, id);

            if (product != null) {

                session.remove(product);

                System.out.println("Product Deleted Successfully");
            }

            transaction.commit();

        } catch (Exception e) {

            if (transaction != null
                    && transaction.getStatus().canRollback()) {

                transaction.rollback();
            }

            e.printStackTrace();
        }
    }
}