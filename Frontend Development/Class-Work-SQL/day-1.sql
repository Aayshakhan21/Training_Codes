-- ==========================================
-- SQL TRAINING DAY 1 ACTIVITIES
-- Trainer : Mam NITI Dwivedi
-- Topic : SQL Basics + CRUD + ALTER
-- ==========================================

/*
THEORY NOTES

1. CREATE DATABASE
Used to create new database.

2. CREATE TABLE
Used to create new table.

3. INSERT
Used to insert records.

4. SELECT
Used to fetch records.

5. UPDATE
Used to modify existing data.

6. DELETE
Used to remove records.

7. ORDER BY
Used to sort records.

8. LIMIT
Used to show top rows.

9. OFFSET
Used to skip rows.

10. ALTER
Used to change table structure.
*/

-- ==========================================
-- ACTIVITY 1 : FOOD DELIVERY DATABASE
-- ==========================================

CREATE DATABASE zomatodb;
USE zomatodb;

CREATE TABLE Customers(
customer_id INT PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100),
city VARCHAR(50)
);

CREATE TABLE Restaurants(
restaurant_id INT PRIMARY KEY,
name VARCHAR(100),
cuisine_type VARCHAR(100),
city VARCHAR(50)
);

CREATE TABLE Orders(
order_id INT PRIMARY KEY,
customer_id INT,
restaurant_id INT,
order_amount DECIMAL(10,2),
order_date DATE
);

INSERT INTO Customers VALUES
(1,'Vishal','hi@vishy.dev','Uttar Pradesh'),
(2,'Aaysha','aaysha@gmail.com','Madhya Pradesh'),
(3,'Aditya','aditya@gmail.com','Pakistan');

INSERT INTO Restaurants VALUES
(101,'Pizza Hut','Italian','Ghaziabad'),
(102,'Dominos','Farm Fresh','Bhopal'),
(103,'Burger Singh','Burger','Lahore');

INSERT INTO Orders VALUES
(1001,1,102,450.00,'2026-04-28'),
(1002,2,101,799.00,'2026-04-28'),
(1003,3,103,1200.00,'2026-04-28');

SELECT * FROM Customers;
SELECT * FROM Restaurants;
SELECT * FROM Orders;

-- ==========================================
-- ACTIVITY 2 : SELECT / UPDATE / DELETE
-- ==========================================

SELECT * FROM Customers;

SELECT * FROM Customers
WHERE city='Pakistan';

SELECT * FROM Orders
WHERE order_amount > 100;

SELECT * FROM Orders
WHERE order_date='2026-04-28';

SELECT * FROM Orders
ORDER BY order_amount DESC;

SELECT * FROM Orders
ORDER BY order_amount DESC
LIMIT 2;

UPDATE Customers
SET city='Delhi'
WHERE name='Aditya';

UPDATE Restaurants
SET cuisine_type='Italian'
WHERE name='Pizza Hut';

UPDATE Orders
SET order_amount=550
WHERE order_id=1001;

DELETE FROM Customers
WHERE customer_id=3;

DELETE FROM Orders
WHERE order_id=1001;

DELETE FROM Restaurants
WHERE city='Bhopal';

SELECT * FROM Customers;
SELECT * FROM Orders;
SELECT * FROM Restaurants;

-- ==========================================
-- EXTRA PRACTICE
-- ==========================================

UPDATE Customers
SET city='Ghaziabad'
WHERE customer_id=1;

-- JDBC Query
-- UPDATE Customers SET city=? WHERE customer_id=?;

DELETE FROM Customers
WHERE customer_id=2;

-- JDBC Query
-- DELETE FROM Customers WHERE customer_id=?;

SELECT * FROM Orders
ORDER BY order_amount DESC;

SELECT * FROM Orders
ORDER BY order_amount DESC
LIMIT 2;

SELECT * FROM Orders
ORDER BY order_amount DESC
LIMIT 1 OFFSET 1;

-- ==========================================
-- DROP / TRUNCATE / DELETE
-- ==========================================

CREATE TABLE temp_users(
id INT,
username VARCHAR(30),
role_name VARCHAR(30)
);

INSERT INTO temp_users VALUES
(1,'A','Admin'),
(2,'B','User');

SELECT * FROM temp_users;

DELETE FROM temp_users WHERE id=2;

TRUNCATE TABLE temp_users;

DROP TABLE temp_users;

-- ==========================================
-- ALTER COMMANDS
-- ==========================================

ALTER TABLE Customers
ADD mobile VARCHAR(15);

ALTER TABLE Customers
MODIFY mobile VARCHAR(20);

ALTER TABLE Customers
RENAME COLUMN mobile TO phone_number;

ALTER TABLE Customers
DROP COLUMN phone_number;

RENAME TABLE Customers TO Customer_Data;

DESC Customer_Data;

-- ==========================================
-- ACTIVITY 3 : EMPLOYEE DATABASE
-- ==========================================

CREATE DATABASE companydb;
USE companydb;

CREATE TABLE employees(
emp_id INT PRIMARY KEY,
emp_name VARCHAR(100),
password VARCHAR(100),
emp_dept VARCHAR(50),
city VARCHAR(50),
salary DECIMAL(10,2)
);

INSERT INTO employees VALUES
(101,'Vishal','vishal@123','IT','Ghaziabad',50000),
(102,'Ravi','ravi@123','Finance','Delhi',60000),
(103,'Aman','aman@123','HR','Noida',45000),
(104,'Priya','priya@123','Finance','Pune',80000),
(105,'Neha','neha@123','Training','Delhi',67000);

SELECT * FROM employees;

UPDATE employees
SET password='Hello@123'
WHERE emp_id=102;

UPDATE employees
SET city='Pune'
WHERE emp_name='Ravi';

DELETE FROM employees
WHERE emp_id=103;

SELECT emp_id,emp_name,salary FROM employees;

SELECT emp_name,salary
FROM employees
WHERE emp_id=101;

SELECT * FROM employees
WHERE emp_dept='Finance';

SELECT * FROM employees
WHERE salary > 60000;

SELECT *
FROM employees
ORDER BY salary DESC
LIMIT 2;

SELECT *
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;

ALTER TABLE employees
ADD joiningdate DATETIME;

UPDATE employees
SET joiningdate=NOW()
WHERE salary=50000;

RENAME TABLE employees TO emp_data;

ALTER TABLE emp_data
MODIFY COLUMN emp_id INT AUTO_INCREMENT PRIMARY KEY;

INSERT INTO emp_data
(emp_name,password,emp_dept,city,salary,joiningdate)
VALUES
('Bhargavi','bhargav@123','Training','Hyderabad',67000,NOW());

ALTER TABLE emp_data
RENAME COLUMN joiningdate TO joining_date;

ALTER TABLE emp_data
DROP COLUMN joining_date;

SELECT * FROM emp_data;
DESC emp_data;

-- ==========================================
-- END OF DAY 1 ACTIVITIES
-- Guided By Mam NITI Dwivedi
-- ==========================================