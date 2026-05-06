/*
REAL WORLD:
Merging cart items or copying objects
*/

// Array copy
const arr1 = [1,2,3];
const arr2 = [...arr1, 4,5];

console.log(arr2);

// Object copy
const user = { name: "Vishy", age: 22 };
const updatedUser = { ...user, role: "Developer" };

console.log(updatedUser);

// Without spread → reference issue
const ref = user;
ref.name = "Changed";

console.log(user.name); // changed (bad practice)