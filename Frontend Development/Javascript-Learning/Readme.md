# 📘 JavaScript Fundamentals & Practice

## 🚀 What is JavaScript?

JavaScript is a **high-level, interpreted programming language** used to make web pages **interactive and dynamic**.
It is one of the three core technologies of web development:

- **HTML** → Defines structure (headings, buttons, forms)
- **CSS** → Defines styling (colors, layout, design)
- **JavaScript** → Adds behavior (clicks, animations, real-time updates)

---

## 👨‍💻 History of JavaScript

- Created by **Brendan Eich** in 1995
- Initially named **Mocha**, then **LiveScript**, and finally **JavaScript**
- First version built in just **10 days**
- Maintained by **ECMA International** under **ECMAScript (ES)** standards

### 🔹 Modern Features (ES6+)

- `let`, `const`
- Arrow functions (`=>`)
- Promises
- Classes
- Modules

---

## 🎯 Why Use JavaScript?

JavaScript is used in almost every modern application:

1. **Interactive Web Pages** → Handle clicks, forms, UI updates
2. **DOM Manipulation** → Modify HTML/CSS dynamically
3. **Web Applications** → Gmail, Facebook, e-commerce apps
4. **Backend Development** → Using Node.js
5. **Games & Animations** → Browser-based games
6. **Event Handling** → Keyboard, mouse, page events

---

## 🧠 Core Concepts

### 🔹 Variables & Keywords

- `let` → block-scoped variable (preferred)
- `const` → constant value (cannot change)
- `var` → function-scoped (avoid in modern JS)

```js
let rollNo = 10;
const pi = 3.14;
```

### 🔹 Reserved Keywords

`break`, `continue`, `if`, `else`, `throw`, `void`, `class`, `for`, `try`, `const`, `let`, `var`

---

### 🔹 Identifiers

Identifiers are names given to:

- Variables
- Functions
- Classes

👉 Naming convention: **camelCase**
Example: `rollNo`, `userName`

---

## 🌳 DOM (Document Object Model)

- DOM represents an HTML page as a **tree structure**
- Allows JavaScript to:
  - Access elements
  - Modify content
  - Add or remove elements

### Example:

```js
document.getElementById("title").innerHTML = "Hello World";
```

👉 HTML alone is **static**, JavaScript makes it **dynamic**

---

## 💰 Mini Project: Salary Calculator

### Problem Statement

A company wants to automate salary calculation based on:

- Basic salary
- Working days
- Bonus

### Tasks:

- Calculate **Gross Salary**
- Apply **Tax Deduction**
- Display **Net Salary**

### Logic:

```js
gross = (basic / totalDays * workingDays) + bonus;

if (gross <= 25000) tax = 5%;
else tax = 10%;

netSalary = gross - tax;
```

---

## ⚙️ Functional Programming

Functional programming focuses on **what to do**, not **how to do it**.

### 🔹 Pure Functions

Functions that:

- Do not modify original data
- Always return the same output for same input

---

## 🔁 Array Methods (Very Important)

### 1. `map()`

Transforms each element → returns new array

```js
const newArr = arr.map((x) => x * 2);
```

---

### 2. `filter()`

Selects elements based on condition

```js
const filtered = arr.filter((x) => x > 10);
```

---

### 3. `reduce()`

Returns a single value (sum, total, etc.)

```js
const sum = arr.reduce((total, num) => total + num, 0);
```

👉 Example:

```js
(sum, p) => sum + p.price;
```

---

## 📦 Project Structure

```plaintext
js-practice/
│
├── index.html              # Dashboard / Entry point
├── product-discount.html   # Discount calculator
├── salary.html             # Salary calculator
├── dom-demo.html           # DOM practice
├── objects-arrays.html     # Objects & arrays
│
└── js/
    ├── app.js
    ├── discount.js
    ├── salary.js
    ├── dom-demo.js
    └── products.js
```

---

## 🎯 Key Learnings

- JavaScript fundamentals (variables, functions)
- DOM manipulation
- Event handling
- Array methods (`map`, `filter`, `reduce`)
- Problem solving (salary, discount)
- Code structure and separation of concerns

---

## 🔥 Interview Summary (Must Say)

> “JavaScript is used to make web applications dynamic. I have worked with DOM manipulation, event handling, and functional programming concepts like map, filter, and reduce while building mini projects like salary and product calculators.”

---

## 📌 Conclusion

JavaScript is a **powerful, versatile language** used across frontend and backend development.
Mastering its fundamentals is essential for becoming a strong developer.

---
