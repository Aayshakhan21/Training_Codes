// Take input
let userName = prompt("Enter user name");
let age = prompt("Enter your age");
let isSubscribed = "true";

// Display on UI
document.getElementById("output").innerText =
    "Your Name: " + userName + " | Your Age: " + age;

// Validate function
function validateForm() {

    console.log("Before Conversion");

    console.log("User Name:", userName, "Type:", typeof userName);
    console.log("Age:", age, "Type:", typeof age);
    console.log("isSubscribed:", isSubscribed, "Type:", typeof isSubscribed);

    // Convert types
    age = Number(age);
    isSubscribed = (isSubscribed === "true");

    console.log("After Conversion");

    console.log("User Name:", userName, "Type:", typeof userName);
    console.log("Age:", age, "Type:", typeof age);
    console.log("isSubscribed:", isSubscribed, "Type:", typeof isSubscribed);
}

// Alert function
function showMessage() {
    alert("The event has occurred");
}

// Object example
const user = {
    role: "client"
};

// Access logic
if (user.role === "admin" && isSubscribed === true) {
    console.log("Access Level: Full Control");
}
else if (user.role === "client" && isSubscribed === false) {
    console.log("Access Level: Partial Control");
}