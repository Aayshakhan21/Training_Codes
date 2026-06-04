// --- Task 1: fetch data from JSON endpoint and log to console ---

// fetch API makes an HTTP request to the provided URL
fetch("https://dummy.restapiexample.com/api/v1/employees")
  .then(response => response.json()) // Convert the response to JSON
  .then(data => console.log("Employee Data:", data)) // Display data on console
  .catch(error => console.error("Error:", error)); // Handle any potential errors


// --- Task 2: fetch random user on button click and display on webpage ---
const btn = document.getElementById("getUserBtn");
const display = document.getElementById("userDisplay");

// listen for a click event on the button
btn.addEventListener("click", () => {
  // fetch data from the Random User API
  fetch("https://randomuser.me/api/")
    .then(response => response.json()) // convert the response to JSON
    .then(data => {
      // extract the first user object from the results array
      const user = data.results[0];
      
      // update the HTML container with user details (name, email, picture)
      display.innerHTML = `
        <h3>${user.name.first} ${user.name.last}</h3>
        <p>Email: ${user.email}</p>
        <img src="${user.picture.large}" alt="User Profile Picture">
      `;
    })
    .catch(error => console.error("Error:", error));
});
