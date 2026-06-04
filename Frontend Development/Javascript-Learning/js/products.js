/*
JSON + DOM MANIPULATION

Concepts:
1. JSON → data format (string)
2. JSON.parse() → converts JSON string into JS object
3. forEach() → iterate over array
4. createElement() → create HTML element
5. append() → add element to DOM
*/

// JSON data (string format)
const jsonData = `[
    {"item": "Laptop", "price": 60000},
    {"item": "Mouse", "price": 500},
    {"item": "Keyboard", "price": 700},
    {"item": "Speaker", "price": 5000}
]`;

// Convert JSON → JavaScript object
const productData = JSON.parse(jsonData);

console.log(productData);
// Output: Array of objects


// Get UL element from HTML
const list = document.getElementById("productList");

// Loop through data
productData.forEach(product => {

    // Create <li>
    const li = document.createElement("li");

    // Add text
    li.textContent = `Product: ${product.item} | Price: ₹${product.price}`;

    // Append to list
    list.append(li);

});