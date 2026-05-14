# Login System (Activity - 2)

## 👩‍🏫 Trainer

Niti Dwivedi Ma'am

---

## 📌 Project Overview

This is a basic **Login System Web Application** built using **Servlets and JSP**.
It demonstrates how login works and how different dashboards are shown after login.

---

## 🛠️ Technologies Used

* Java (Servlets)
* JSP
* Apache Tomcat
* HTML / CSS
* Web.xml configuration

---

## 📂 Project Structure

```
src/main/java/com/ecomm/servlet/
    ├── LoginDashboard.java
    ├── ProductsDashboard.java
    ├── UserDashboard.java

src/main/webapp/
    ├── META-INF/
    ├── WEB-INF/
    │     ├── lib/
    │     └── web.xml
    ├── dashboard.jsp
    ├── form.jsp
    ├── login.jsp
    └── product.jsp
```

---

## ⚙️ Features

* User Login Page
* Dashboard after login
* Product display page
* Servlet-based request handling
* JSP for UI rendering

---

## 🔄 Flow of Application

1. User opens **login.jsp**
2. Enters login details
3. Request goes to **Servlet**
4. Servlet processes data
5. Redirects to dashboard or product page
6. JSP displays response

---

## 🚀 How to Run

1. Import project into IDE (Eclipse)
2. Configure **Apache Tomcat Server**
3. Run project on server
4. Open in browser:

   ```
   http://localhost:8080/LoginSystemDispatch/
   ```

---

## ✅ Objective

* Understand **Servlet + JSP integration**
* Learn **request and response handling**
* Build a basic **dynamic web application**

---
