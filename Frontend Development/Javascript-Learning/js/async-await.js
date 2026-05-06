/*
REAL WORLD:
Loading posts (like Twitter feed)
*/

async function getPosts() {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();

    const list = document.getElementById("posts");

    data.slice(0,5).forEach(post => {
        const li = document.createElement("li");
        li.textContent = post.title;
        list.append(li);
    });
}

getPosts();