/*
Concepts Used:

1. forEach → iterate over array
2. reduce → calculate total
3. map → transform array (apply discount)
4. filter → get items based on condition
*/

const output = document.getElementById("output");

// Product array
const products = [
    { name: "Mobile", price: 16000 },
    { name: "Laptop", price: 55000 },
    { name: "TV", price: 30000 },
    { name: "Headphones", price: 5000 },
    { name: "Washing Machine", price: 25000 }
];

// Display original products
let html = "<h3>Original Products</h3>";

products.forEach(p => {
    html += p.name + " : ₹" + p.price + "<br>";
});

// Total before discount
const totalBefore = products.reduce((sum, p) => sum + p.price, 0);
html += "<br><b>Total Before Discount: ₹" + totalBefore + "</b><br><br>";

// Apply 10% discount
const discountedProducts = products.map(p => ({
    name: p.name,
    price: p.price - (p.price * 0.10)
}));

html += "<h3>Discounted Products</h3>";

discountedProducts.forEach(p => {
    html += p.name + " : ₹" + p.price + "<br>";
});

// Total after discount
const totalAfter = discountedProducts.reduce((sum, p) => sum + p.price, 0);
html += "<br><b>Total After Discount: ₹" + totalAfter + "</b><br><br>";

// Filter products > 10000
const filtered = discountedProducts.filter(p => p.price > 10000);

html += "<h3>Products > 10000 (After Discount)</h3>";

filtered.forEach(p => {
    html += p.name + " : ₹" + p.price + "<br>";
});

// Total of filtered
const totalFiltered = filtered.reduce((sum, p) => sum + p.price, 0);
html += "<br><b>Total Filtered Price: ₹" + totalFiltered + "</b>";

// Display output
output.innerHTML = html;