/*
VAR, LET & CONST

- var → function scoped, hoisted
- let → block scoped, TDZ
- const → block scoped, cannot be reassigned
*/

// Shadowing
function test() {
  let a = "Hello";

  if (true) {
    let a = "Hi"; // different variable
    console.log(a); // Hi
  }

  console.log(a); // Hello
}
test();

// Hoisting
console.log(a); // undefined
var a = 10;

// Temporal Dead Zone
// console.log(b); error
let b = 20;