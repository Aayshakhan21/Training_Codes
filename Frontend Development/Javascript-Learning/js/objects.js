/*
Q1: Delete keyword in object
*/

const func = (function(a){
    // delete a;
    return a;
})(5);

console.log(func);

// Output: 5
// Explanation: delete only works on object properties, not local variables


/*
Q2: Duplicate keys
*/

const obj = { a: 'one', b: 'two', a: 'three' };
console.log(obj);

// Output: {a: "three", b: "two"}
// Explanation: Last value overrides previous ones


/*
Q3: Multiply numeric values
*/

let nums = { a: 100, b: 200, title: "My nums" };

function multiplyByTwo(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'number') {
            obj[key] *= 2;
        }
    }
}

multiplyByTwo(nums);
console.log(nums);

// Output: {a: 200, b: 400, title: "My nums"}


/*
Q4: Object key behavior
*/

const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);

// Output: 456
// Explanation: Objects become "[object Object]" as keys → overwritten


/*
Q5: Spread string
*/

console.log([..."Lydia"]);

// Output: ["L","y","d","i","a"]


/*
Q6: Object reference
*/

let c1 = { greeting: 'Hey!' };
let d1 = c1;

c1.greeting = 'Hello';

console.log(d1.greeting);

// Output: Hello
// Explanation: Objects are reference types


/*
Q7: Object comparison
*/

console.log({a:1} == {a:1});
// console.log({a:1} === {a:1});

// Output: false false
// Explanation: Different memory references


/*
Q8: Destructuring
*/

let user = {
    fullName: { firstName: "Piyush" }
};

const { fullName: { firstName } } = user;

console.log(firstName);

// Output: "Piyush"