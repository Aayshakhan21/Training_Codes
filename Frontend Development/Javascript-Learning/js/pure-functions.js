/*
REAL WORLD:
Price calculation without modifying original data
*/

// Pure function
function calculateDiscount(price) {
    return price * 0.9;
}

console.log(calculateDiscount(1000));

// Original salaries
const salaries = [45000, 67000, 36000];

// 1. Increment salary using map (Pure Function)
const newSalaries = salaries.map(salary => salary + 1000);
document.writeln("New Salary using map(): " + newSalaries);

// 2. Filter high paid employees using filter (Pure Function)
const highlyPaidEmployees = salaries.filter(salary => salary > 20000);
document.writeln("Highly paid employees using filter(): " + highlyPaidEmployees);

// 3. Calculate total salary using reduce (Pure Function)
const totalSalary = salaries.reduce((total, salary) => total + salary, 0);
document.writeln("Total salary using reduce(): " + totalSalary);

// Impure function
let total = 0;

function addToTotal(price) {
    total += price;
}

addToTotal(100);
console.log(total);