// Cart data (simulating API response)
const cart = [
  { id: 1, name: "Laptop", price: 60000, qty: 2, category: "Electronics" },
  { id: 2, name: "Mouse", price: 500, qty: 5, category: "Electronics" },
  { id: 3, name: "Keyboard", price: 1000, qty: 3, category: "Electronics" },
  { id: 4, name: "Monitor", price: 15000, qty: 2, category: "Electronics" }
];

const output = document.getElementById("output");

// 1. Product names using map()
const productNames = cart.map(item => item.name);

// 2. Total price using reduce()
const totalPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0);

// 3. Filter products (price > 1000)
const threshold = 1000;
const filteredProducts = cart.filter(item => item.price > threshold);

// 4. Total quantity function (pure function)
const calculateTotalItems = (items) =>
  items.reduce((total, item) => total + item.qty, 0);

const totalItems = calculateTotalItems(cart);

// 5. Display using template literals
output.innerHTML = `
  <h3>Product Names:</h3>
  <p>${productNames.join(", ")}</p>

  <h3>Total Price:</h3>
  <p>₹${totalPrice}</p>

  <h3>Filtered Products (Price > ₹${threshold}):</h3>
  <p>${filteredProducts.map(p => p.name).join(", ")}</p>

  <h3>Total Items in Cart:</h3>
  <p>${totalItems}</p>

  <h3>Detailed Cart:</h3>
  <ul>
    ${cart.map(item => `
      <li>
        ${item.name} → ₹${item.price} × ${item.qty} = ₹${item.price * item.qty}
      </li>
    `).join("")}
  </ul>
`;