// Fetch users from API
fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(data => {
    const ul = document.getElementById("users");

    data.forEach(user => {
      const li = document.createElement("li");
      li.textContent = `User Name: ${user.username} - Email: ${user.email}`;
      ul.appendChild(li);
    });
  })
  .catch(err => console.error("Error while loading data:", err));


// Example to show async behavior
console.log("Fetching data...");

setTimeout(() => {
  console.log("Simulating delay (5 sec)");
}, 5000);

for (let i = 0; i <= 3; i++) {
  console.log("Doing other work:", i);
}