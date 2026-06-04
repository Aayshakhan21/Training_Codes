document.writeln("JavaScript Variables <br>");

// Variables
var age = 40;
const myName = "Niti";
var isTrue = true;

console.log(typeof (age));
console.log(typeof (myName));
console.log(typeof (isTrue));

// Conversion
let score = "787";

let toIntScore = Number(score);
let average = toIntScore / 5;

console.log("Average is: " + average);

// Scope example
var name = "Niti";
let counter = 30;

function counter1() {
    let counter = 10; // block scope
}

name = "Niti Sharma";

console.log(name);
console.log(counter);