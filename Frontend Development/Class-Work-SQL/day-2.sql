-- ==========================================
-- SQL TRAINING DAY 2 ACTIVITY
-- Trainer : Mam NITI Dwivedi
-- Topic : Constraints + Joins + Subqueries
-- ==========================================

/*
THEORY NOTES

1. DEFAULT
If user does not give value, default value is inserted.

2. UNIQUE
Allows only unique values.

3. NOT NULL
Column cannot store NULL value.

4. CHECK
Used for validation.
Example: qty > 0

5. INNER JOIN
Returns matching rows from both tables.

6. LEFT JOIN
All rows from left table + matching rows from right table.

7. RIGHT JOIN
All rows from right table + matching rows from left table.

8. FULL OUTER JOIN
LEFT JOIN + RIGHT JOIN using UNION.

9. SELF JOIN
Join same table with itself.

10. SUBQUERY
Query inside another query.
*/

-- ==========================================
-- DATABASE
-- ==========================================

CREATE DATABASE ems;
USE ems;

-- ==========================================
-- CONSTRAINTS TABLE
-- ==========================================

CREATE TABLE cart_items(
item_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
qty INT NOT NULL,
sales_tax DECIMAL(5,2) NOT NULL DEFAULT 0.10,
CONSTRAINT chkqty CHECK(qty > 0),
CONSTRAINT chkst CHECK(sales_tax >= 0)
);

DESC cart_items;

-- Insert Records
INSERT INTO cart_items VALUES
(101,'Niti',300,0.20);

INSERT INTO cart_items(item_id,name,qty)
VALUES
(102,'Shaina',400);

SELECT * FROM cart_items;

-- Show table query
SHOW CREATE TABLE cart_items;

-- Show all constraints
SELECT *
FROM information_schema.check_constraints
WHERE constraint_schema='ems';

-- Drop constraint
ALTER TABLE cart_items
DROP CONSTRAINT chkqty;

-- ==========================================
-- JOINS TABLES
-- ==========================================

CREATE TABLE department(
dept_id INT PRIMARY KEY,
dept_name VARCHAR(20)
);

CREATE TABLE employee(
emp_id INT PRIMARY KEY,
emp_name VARCHAR(30),
dept_id INT,
FOREIGN KEY(dept_id) REFERENCES department(dept_id)
);

-- Insert Department Data
INSERT INTO department VALUES
(10,'HR'),
(20,'IT'),
(30,'Sales'),
(40,'Admin'),
(50,'Training'),
(60,'Finance');

-- Insert Employee Data
INSERT INTO employee VALUES
(101,'Jiya',10),
(102,'Shubham',20),
(103,'Rohit',30),
(104,'Richa',10);

SELECT * FROM department;
SELECT * FROM employee;

-- ==========================================
-- INNER JOIN
-- ==========================================

SELECT e.emp_name,d.dept_name
FROM employee e
INNER JOIN department d
ON e.dept_id=d.dept_id;

-- ==========================================
-- LEFT JOIN
-- ==========================================

SELECT d.dept_id,e.emp_name,d.dept_name
FROM employee e
LEFT JOIN department d
ON e.dept_id=d.dept_id;

-- ==========================================
-- RIGHT JOIN
-- ==========================================

SELECT d.dept_id,e.emp_name,d.dept_name
FROM employee e
RIGHT JOIN department d
ON e.dept_id=d.dept_id;

-- ==========================================
-- FULL OUTER JOIN
-- ==========================================

SELECT e.emp_name,d.dept_name
FROM employee e
LEFT JOIN department d
ON e.dept_id=d.dept_id

UNION

SELECT e.emp_name,d.dept_name
FROM employee e
RIGHT JOIN department d
ON e.dept_id=d.dept_id;

-- ==========================================
-- SELF JOIN
-- ==========================================

CREATE TABLE empmanager(
empid INT,
name VARCHAR(30),
manager_id INT
);

INSERT INTO empmanager(empid,name)
VALUES
(1,'Niti');

INSERT INTO empmanager VALUES
(2,'Jiya',1),
(3,'Shubham',2),
(4,'Richa',1);

SELECT * FROM empmanager;

-- Employee Name with Manager Name

SELECT e1.name AS employeename,
       e2.name AS managername
FROM empmanager e1
LEFT JOIN empmanager e2
ON e1.manager_id=e2.empid;

-- ==========================================
-- SUBQUERY TABLE
-- ==========================================

CREATE TABLE salary(
emp_id INT,
salary DECIMAL(10,2)
);

INSERT INTO salary VALUES
(101,50000),
(102,70000),
(103,45000),
(104,80000);

SELECT * FROM salary;

-- Employees having salary above average salary

SELECT e.emp_name
FROM employee e
INNER JOIN salary s
ON e.emp_id=s.emp_id
WHERE s.salary >
(
SELECT AVG(salary)
FROM salary
);

-- ==========================================
-- MULTI ROW SUBQUERY
-- ==========================================

-- Employees from Sales or IT Department

SELECT e.emp_name
FROM employee e
WHERE dept_id IN
(
SELECT dept_id
FROM department
WHERE dept_name IN ('Sales','IT')
);

-- ==========================================
-- ANY OPERATOR
-- ==========================================

CREATE TABLE employees(
emp_id INT,
emp_name VARCHAR(30),
dept_id INT,
salary DECIMAL(10,2)
);

INSERT INTO employees VALUES
(1,'Aman',30,40000),
(2,'Vishal',20,70000),
(3,'Ravi',30,50000),
(4,'Neha',10,80000);

-- Salary greater than any salary in Sales department

SELECT *
FROM employees
WHERE salary > ANY
(
SELECT salary
FROM employees
WHERE dept_id=30
);

-- ==========================================
-- SQL ACTIVITY : QuickBite Case Study
-- Trainer : NITI Dwivedi Mam
-- Topic : Joins + Subqueries
-- ==========================================

/*
TABLES USED
customers (customer_id, customer_name, city)
restaurants (restaurant_id, restaurant_name, city)
orders (order_id, customer_id, restaurant_id, order_amount, order_date)
*/

CREATE DATABASE quickbite;
USE quickbite;

CREATE TABLE customers(
customer_id INT PRIMARY KEY,
customer_name VARCHAR(100),
city VARCHAR(50)
);

CREATE TABLE restaurants(
restaurant_id INT PRIMARY KEY,
restaurant_name VARCHAR(100),
city VARCHAR(50)
);

CREATE TABLE orders(
order_id INT PRIMARY KEY,
customer_id INT,
restaurant_id INT,
order_amount DECIMAL(10,2),
order_date DATE
);

INSERT INTO customers VALUES
(1,'Vishal','Delhi'),
(2,'Ravi','Noida'),
(3,'Neha','Delhi'),
(4,'Aman','Mumbai');

INSERT INTO restaurants VALUES
(101,'Pizza Hut','Delhi'),
(102,'Dominos','Noida'),
(103,'Burger King','Mumbai'),
(104,'KFC','Delhi');

INSERT INTO orders VALUES
(1001,1,101,500,'2026-04-20'),
(1002,2,102,700,'2026-04-21'),
(1003,3,104,1200,'2026-04-22'),
(1004,1,101,800,'2026-04-23');

-- ==========================================
-- ACTIVITY 1 : JOINS
-- ==========================================

-- Q1 INNER JOIN
SELECT c.customer_name, r.restaurant_name, o.order_amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN restaurants r ON o.restaurant_id = r.restaurant_id;

-- Q2 LEFT JOIN
SELECT c.customer_name, o.order_id, o.order_amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;

-- Q3 RIGHT JOIN
SELECT r.restaurant_name, o.order_id, o.order_amount
FROM orders o
RIGHT JOIN restaurants r ON o.restaurant_id = r.restaurant_id;

-- Q4 FULL OUTER JOIN (MySQL workaround)
SELECT c.customer_name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id

UNION

SELECT c.customer_name, o.order_id
FROM customers c
RIGHT JOIN orders o ON c.customer_id = o.customer_id;

-- Q5 SELF JOIN (same city customers)
SELECT c1.customer_name AS Customer1,
       c2.customer_name AS Customer2,
       c1.city
FROM customers c1
JOIN customers c2
ON c1.city = c2.city
AND c1.customer_id <> c2.customer_id;

-- ==========================================
-- ACTIVITY 2 : SUBQUERIES
-- ==========================================

-- Q6 Customers with order above average
SELECT DISTINCT c.customer_name
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_amount >
(
SELECT AVG(order_amount) FROM orders
);

-- Q7 Restaurants with at least one order
SELECT restaurant_name
FROM restaurants
WHERE restaurant_id IN
(
SELECT DISTINCT restaurant_id FROM orders
);

-- Q8 Customer with highest order
SELECT c.customer_name, o.order_amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_amount =
(
SELECT MAX(order_amount) FROM orders
);

-- ==========================================
-- ACTIVITY 3 : CORRELATED SUBQUERIES
-- ==========================================

-- Q9 Customers whose order > their own average
SELECT DISTINCT c.customer_name
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_amount >
(
SELECT AVG(o2.order_amount)
FROM orders o2
WHERE o2.customer_id = c.customer_id
);

-- Q10 Restaurants whose avg order > overall avg
SELECT r.restaurant_name
FROM restaurants r
JOIN orders o ON r.restaurant_id = o.restaurant_id
GROUP BY r.restaurant_id, r.restaurant_name
HAVING AVG(o.order_amount) >
(
SELECT AVG(order_amount) FROM orders
);

-- ==========================================
-- END OF DAY 2 ACTIVITY
-- Guided By Mam NITI Dwivedi
-- ==========================================