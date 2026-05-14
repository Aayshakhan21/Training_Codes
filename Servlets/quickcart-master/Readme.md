# 🛒 QuickCart Retail System (Activity - 1)

## 📌 Overview

This project is a **basic e-commerce module** built using **Java Servlets and JSP**.
It demonstrates login functionality and a product dashboard using standard **MVC architecture**.

---

## 🧱 Tech Stack

* Java (JDK 17)
* JSP & Servlets (Jakarta EE)
* Apache Tomcat 10/11 (Servlet Container)
* Bootstrap (UI)

---

## ⚙️ Key Concept: Servlet Container

A **Servlet Container (Tomcat)** is responsible for:

* Managing servlet lifecycle
* Handling HTTP requests & responses
* Mapping URLs to servlets

👉 It plays a role similar to **JVM in Core Java**, but for web applications.

---

## 📁 Project Structure

```
quickcart/
│
├── src/main/java/com/quickcart/controller/
│   ├── LoginServlet.java
│   └── ProductServlet.java
│
├── src/main/webapp/
│   ├── login.jsp
│   ├── dashboard.jsp
│   ├── error.jsp
│   └── WEB-INF/
│       └── web.xml
```

---

## 🔄 Application Flow (MVC)

```
User → login.jsp → LoginServlet → validate
    → success → ProductServlet → dashboard.jsp
    → failure → error.jsp
```

---

## 🌐 HTTP Methods: doGet vs doPost

### 🔹 doGet() → Fetch Data

Used for:

* Fetching dashboard data
* Searching products
* Pagination APIs

Example:

```
http://localhost:8080/LoginSystem/login?mail=abc@gmail.com&pass=admin
```

❌ Drawbacks:

* Data visible in URL (not secure)
* Can be cached
* Limited data size

---

### 🔹 doPost() → Submit Data

Used for:

* Login
* Registration
* Payment

✔ Advantages:

* Data sent in **request body (hidden)**
* More secure than GET
* Not cached

---

## 🔁 RequestDispatcher

`RequestDispatcher` is an interface used for **server-side request transfer**.

### 🔹 Methods

#### 1. forward()

```java
request.getRequestDispatcher("dashboard.jsp").forward(request, response);
```

✔ Server-side transfer
✔ Same request & response object
✔ URL does NOT change
✔ Used in MVC navigation

---

#### 2. include()

```java
request.getRequestDispatcher("header.jsp").include(request, response);
```

✔ Includes content of another resource
✔ Response gets appended
✔ Used for reusable components (header/footer)

---

## 🔄 sendRedirect()

```java
response.sendRedirect("products.jsp");
```

✔ Client-side redirect
✔ Browser sends new request
✔ URL changes
✔ Slower than forward

---

## ⚙️ ServletConfig vs ServletContext

### 🔹 ServletConfig (Per Servlet Scope)

Used for:

* Servlet-specific configuration
* API keys, email, policy

Example (web.xml):

```xml
<servlet>
    <servlet-name>MyServlet</servlet-name>
    <servlet-class>com.example.MyServlet</servlet-class>

    <init-param>
        <param-name>admin_email</param-name>
        <param-value>admin@example.com</param-value>
    </init-param>
</servlet>
```

---

### 🔹 ServletContext (Application Scope)

Used for:

* Global configuration
* Database name
* Logging

Example:

```xml
<context-param>
    <param-name>db_name</param-name>
    <param-value>ProductionDB</param-value>
</context-param>
```

---

## 🚀 How to Run

1. Import project into Eclipse
2. Configure Apache Tomcat server
3. Run project on server
4. Open browser:

```
http://localhost:8080/quickcart/
```

---

## 🔐 Login Credentials

```
Email: admin@quickcart.com
Password: 1234
```

---

## 🎯 Key Learnings

* Servlet lifecycle & request handling
* MVC architecture (Servlet + JSP)
* GET vs POST methods
* RequestDispatcher vs sendRedirect
* ServletConfig & ServletContext scopes

---

## 📚 Trainer

* Niti Dwivedi Mam

---

## 👨‍💻 Author

Vishal Shah
