# 📅 Day 2 - SQL Joins & JDBC Maven Project

## 📘 What I Learned

### 🔹 SQL Joins

Today I learned how to combine data from multiple tables using joins:

* **INNER JOIN** → returns matching records from both tables
* **LEFT JOIN** → returns all records from left table + matching from right
* **RIGHT JOIN** → returns all records from right table + matching from left
* **SELF JOIN** → joins a table with itself

These are useful for retrieving relational data in real-world databases.

---

## 💻 Maven JDBC Project

I created a simple **Product Management System** using:

* Core Java
* JDBC (MySQL Connector)
* Maven

---

## ⚙️ Features Implemented

* ➕ Add Product
* 📄 View All Products
* ✏️ Update Product
* ❌ Delete Product

---

## 🗄️ Database Used

```sql
create database productdb;
use productdb;

create table product (
    id int primary key auto_increment,
    name varchar(70),
    price double
);
```

---

## 🔌 Database Configuration

```properties
url=jdbc:mysql://localhost:3306/productdb
username=root
password=root
```

---

## 📂 Project Structure

```plaintext
src/main/java/com/company/
├── main        → Main application (menu-driven)
├── dao         → Database operations (CRUD)
├── model       → Product class (POJO)
└── util        → DB connection utility

src/main/resources/
└── db.properties
```

---

## 🚀 How It Works

1. User selects an option from menu
2. Application calls DAO layer
3. DAO uses JDBC to interact with MySQL
4. Result is displayed in console

---

## 🧠 Key Concepts Covered

* JDBC Connection (DriverManager)
* PreparedStatement
* ResultSet
* Maven dependency management
* SQL Joins basics

---

## 🎯 Outcome

Built a basic **console-based CRUD application** and understood how Java interacts with a relational database using JDBC.

---

## Trainer

* Niti Dwivedi Mam

---
