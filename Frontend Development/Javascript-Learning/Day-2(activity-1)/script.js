const apiurl = "https://jsonplaceholder.typicode.com/users";
const ul = document.getElementById("users");


// 🔹 FETCH USERS (GET)
function fetchUser() {
  ul.innerHTML = "";

  fetch(apiurl)
    .then(res => res.json())
    .then(users => {
      users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = `User: ${user.username} - Email: ${user.email}`;
        ul.appendChild(li);
      });
    })
    .catch(err => console.error("Error:", err));
}


// 🔹 ADD USER (POST)
function addUser() {
  const newUser = {
    name: "Niti Dwivedi",
    email: "nitidwivedi8932@gmail.com"
  };

  fetch(apiurl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser)
  })
    .then(res => res.json())
    .then(data => {
      alert("User added successfully");
      fetchUser();
    })
    .catch(err => console.error("Error:", err));
}


// 🔹 UPDATE USER (PUT)
function updateUser() {
  const id = prompt("Enter user ID to update:");

  fetch(`${apiurl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Updated User",
      email: "updated@gmail.com"
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("User updated successfully");
      fetchUser();
    })
    .catch(err => console.error("Error:", err));
}


// 🔹 DELETE USER (DELETE)
function deleteUser() {
  const id = prompt("Enter user ID to delete:");

  fetch(`${apiurl}/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      alert("User deleted successfully");
      fetchUser();
    })
    .catch(err => console.error("Error:", err));
}