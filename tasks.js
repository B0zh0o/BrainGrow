import { checkAuth } from "./auth.js";

let currentUser = null;
const taskList = document.getElementById("taskList");
const form = document.querySelector(".task-form");
const usernameSpan = document.getElementById("username");  // <--- NEW

async function init() {
    currentUser = await checkAuth();  // redirect if not logged in

    if (currentUser && usernameSpan) {
        usernameSpan.textContent = currentUser.username;  // <--- set username
    }

    loadTasks();
}

async function loadTasks() {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch("http://localhost:3000/tasks", {
            headers: { "Authorization": "Bearer " + token }
        });
        const tasks = await res.json();

        taskList.innerHTML = "";

        tasks.forEach(task => {
            const div = document.createElement("div");
            div.className = "task";

            const due = task.due
                ? new Date(task.due).toLocaleDateString()
                : "No due date";

            const importanceColor = getImportanceColor(task.importance);

            div.innerHTML = `
                <div class="task-left">
                    <div class="task-title">${task.title}</div>
                    <div class="task-type">${task.type}</div>
                    <div class="task-desc">${task.description || ""}</div>
                    <div class="task-meta">
                        <span>📅 ${due}</span>
                        ${task.importance ? `<span style="color:${importanceColor}">● Priority ${task.importance}</span>` : ""}
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            `;
            taskList.appendChild(div);
        });

    } catch (err) {
        console.error(err);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value;
    const due = document.getElementById("due").value;
    const importance = document.getElementById("importance").value;
    const token = localStorage.getItem("token");

    try {
        await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                title, type, description, due: due || null, importance: importance || null
            })
        });

        form.reset();
        loadTasks();
    } catch (err) {
        console.error(err);
    }
});

async function deleteTask(id) {
    const token = localStorage.getItem("token");
    try {
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
        loadTasks();
    } catch (err) {
        console.error(err);
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function getImportanceColor(value) {
    if (!value) return "#888";
    if (value <= 3) return "#22c55e";
    if (value <= 6) return "#eab308";
    if (value <= 8) return "#f97316";
    return "#ef4444";
}

window.logout = logout;  // make logout available in HTML
window.deleteTask = deleteTask;

init();