
/*
DOM Methods & Concepts:

1. getElementById()
   → Used to access HTML elements using their ID.

2. addEventListener()
   → Used to listen for events like click, submit, etc.

3. innerHTML
   → Used to change or update the content of an element.

4. DOM Manipulation
   → Allows updating content, structure, and styling dynamically
     without reloading the webpage.
*/


// Access button using DOM
const button = document.getElementById("changeText");

// addEventListener waits for a click event
button.addEventListener("click", function () {

    // innerHTML updates content dynamically
    document.getElementById("welcome").innerHTML = "We have changed the Text";

});