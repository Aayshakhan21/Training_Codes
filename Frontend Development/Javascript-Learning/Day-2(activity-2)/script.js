// api url for mockapi
const API = "https://69f86254dd0c226688ee8f3d.mockapi.io/vishy/employees";

// displaying all employees
async function load() {
  const res = await fetch(API);
  const data = await res.json();

  let html = "";
  data.forEach(e => {
    html += `
      <tr>
        <td>${e.name}</td>
        <td>${e.email}</td>
        <td>
          <button onclick="edit('${e.id}','${e.name}','${e.email}')">edit</button>
          <button onclick="del('${e.id}')">delete</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("employeeContainer").innerHTML = html;
}

// add or update employee
async function save() {
  const id = document.getElementById("empId").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  const data = { name, email, company: "company" };

  if (id) {
    // update
    await fetch(API + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } else {
    // add
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  document.getElementById("empId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";

  load();
}

// fill form for editing
function edit(id, name, email) {
  document.getElementById("empId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
}

// delete employee
async function del(id) {
  await fetch(API + "/" + id, { method: "DELETE" });
  load();
}

load();