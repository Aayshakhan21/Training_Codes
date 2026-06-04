/*
CURRYING

- Function returning another function
- Breaks multi-argument into single argument calls
*/

// Basic
function sum(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log(sum(1)(2)(3));

// Infinite currying
function add(a) {
  return function(b) {
    if (b) return add(a + b);
    return a;
  };
}

console.log(add(1)(2)(3)(4)());

// Real-world
const updateText = id => content =>
  document.querySelector(`#${id}`).textContent = content;