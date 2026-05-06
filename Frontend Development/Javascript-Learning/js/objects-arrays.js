
/*
Objects and Arrays in JavaScript

Object:
- Collection of properties (key-value pairs)
- Example: { name: "Vishal", role: "admin" }

Array:
- Ordered collection of values
- Can store multiple data types
*/

// Object creation
const user = {
    name: "Vishal",
    role: "admin"
};

// Empty object
let student = {};

// Object with properties
let person = {
    firstName: "Vishal",
    lastName: "Shah"
};

// Updating object properties
person.firstName = "Vinay";
person.lastName = "Shah";

// Adding new property
person.age = 24;

// Checking property existence
console.log('age' in person);   // true
console.log('name' in person);  // false

// Deleting property
delete person.age;

// Print object
console.log(person);


// ---------------- ARRAY SECTION ----------------

// Array declaration
let address = ["Ghaziabad", "Uttar Pradesh"];

// Array with numbers
const colorCodes = [4, 6, 7, 4];

// Mixed data types in array
const mixedArray = ["hello", 45454, true, { address: "New Delhi" }];

// Access array elements
console.log(address[0]); // Ghaziabad

// Print full array
console.log(address);