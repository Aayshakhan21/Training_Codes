/*
REAL WORLD:
Fetching users from backend (like Instagram users list)
*/

fetch("https://jsonplaceholder.typicode.com/users")
.then(res => res.json())
.then(data => {

    const list = document.getElementById("users");

    data.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user.name;
        list.append(li);
    });

});