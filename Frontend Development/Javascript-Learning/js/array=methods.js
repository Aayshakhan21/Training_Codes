/*
MAP, FILTER, REDUCE

map() → transform array
filter() → select elements
reduce() → aggregate to single value
*/

const nums = [1, 2, 3, 4];

// map
const triple = nums.map(n => n * 3);
console.log(triple);

// filter
const greaterThanTwo = nums.filter(n => n > 2);
console.log(greaterThanTwo);

// reduce
const sum = nums.reduce((acc, curr) => acc + curr, 0);
console.log(sum);

// Polyfill (important for interviews)
Array.prototype.myMap = function(cb) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(cb(this[i], i, this));
  }
  return result;
};