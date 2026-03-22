const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const taskList = document.getElementById("taskList");
const form = document.getElementById("taskForm");

async function loadTasks() {
    const res = await fetch("http://localhost:3000/tasks", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const tasks = await res.json();

    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        li.innerHTML = `
            <b>${task.title}</b> (${task.type})
            <br>
            ${task.description || ""}
            <br>
            <button onclick="deleteTask(${task.id})">Delete</button>
            <hr>
        `;

        taskList.appendChild(li);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value;

    await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            title,
            type,
            description
        })
    });

    form.reset();
    loadTasks();
});

async function deleteTask(id) {
    await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadTasks();
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

loadTasks();