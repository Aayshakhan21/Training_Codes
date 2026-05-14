/*
REAL WORLD:
E-commerce site receives product data from backend in JSON
*/

const jsonData = `[
  {"name": "Laptop", "price": 60000},
  {"name": "Phone", "price": 30000}
]`;

const data = JSON.parse(jsonData);

const list = document.getElementById("list");

data.forEach(product => {
    const li = document.createElement("li");
    li.textContent = `${product.name} - ₹${product.price}`;
    list.append(li);
});