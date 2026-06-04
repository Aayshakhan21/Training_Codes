/*
CLOSURE

- Function remembers variables from outer scope
*/

function outer() {
  let count = 0;

  return function() {
    count++;
    console.log(count);
  };
}

const counter = outer();
counter();
counter();

// Private variable example
function counterPrivate() {
  let _count = 0;

  return {
    add(val) {
      _count += val;
    },
    get() {
      return _count;
    }
  };
}

const c = counterPrivate();
c.add(5);
console.log(c.get());