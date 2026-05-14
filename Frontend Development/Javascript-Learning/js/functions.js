/*
FUNCTIONS

- First-class citizens
- Can be passed as arguments
*/

// Callback
function square(num) {
  return num * num;
}

function display(fn) {
  console.log(fn(5));
}
display(square);

// IIFE
(function(x){
  console.log(x * x);
})(5);

// Scope
var name = "JS";

function test() {
  var name = "Local";
  console.log(name);
}
test();

// Arrow function
const add = (a, b) => a + b;

// Rest & Spread
function multiply(...nums) {
  console.log(nums[0] * nums[1]);
}
multiply(5, 7);