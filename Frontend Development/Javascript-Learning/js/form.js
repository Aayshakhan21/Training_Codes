let userName = prompt("Enter user name");
let age = prompt("Enter your age");
let isSubscribed = "true";

function validateForm(userName, age, isSubscribed) {

    console.log("Before Conversion");

    console.log("User Name:", userName, "Type:", typeof userName);
    console.log("Age:", age, "Type:", typeof age);
    console.log("isSubscribed:", isSubscribed, "Type:", typeof isSubscribed);

    // Conversion
    age = Number(age);
    isSubscribed = (isSubscribed === "true");

    console.log("After Conversion");

    console.log("User Name:", userName, "Type:", typeof userName);
    console.log("Age:", age, "Type:", typeof age);
    console.log("isSubscribed:", isSubscribed, "Type:", typeof isSubscribed);
}

validateForm(userName, age, isSubscribed);