/*
Q1: Global this
*/

let a = 5;
console.log(this.a);

// Output: 5 (in browser)
// Explanation: global this = window


/*
Q2: Method
*/

let user = {
    name: "Piyush",
    getDetails() {
        console.log(this.name);
    }
};

user.getDetails();

// Output: Piyush


/*
Q3: Nested object
*/

let user2 = {
    name: "Piyush",
    child: {
        newName: "Coder",
        getDetails() {
            console.log(this.newName, this.name);
        }
    }
};

user2.child.getDetails();

// Output: Coder undefined
// Explanation: this refers to child object


/*
Q4: Arrow vs Normal
*/

const obj = {
    name: "Piyush",
    normal() {
        console.log(this.name);
    },
    arrow: () => {
        console.log(this.name);
    }
};

obj.normal();
obj.arrow();

// Output:
// Piyush
// undefined
// Explanation: arrow function doesn't have its own this


/*
Q5: setTimeout
*/

const user3 = {
    name: "Piyush",
    log() {
        console.log(this.name);
    }
};

setTimeout(user3.log, 1000);

// Output: undefined
// Explanation: lost reference


/*
Q6: Fix setTimeout
*/

setTimeout(() => user3.log(), 1000);

// Output: Piyush


/*
Q7: Method chaining
*/

var calc = {
    total: 0,
    add(a) {
        this.total += a;
        return this;
    },
    multiply(a) {
        this.total *= a;
        return this;
    }
};

console.log(calc.add(10).multiply(5).total);

// Output: 50