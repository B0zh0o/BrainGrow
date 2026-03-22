const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

const taskList = document.getElementById("taskList");
const form = document.getElementById("taskForm");

async function loadTasks() {
    try {
        const res = await fetch("http://localhost:3000/tasks", {
            headers: { "Authorization": "Bearer " + token }
        });
        const tasks = await res.json();

        taskList.innerHTML = "";
        tasks.forEach(task => {
            const li = document.createElement("li");
            li.innerHTML = `
                <b>${task.title}</b> (${task.type})
                <p>${task.description || ""}</p>
                <button onclick="deleteTask(${task.id})">Delete</button>
            `;
            taskList.appendChild(li);
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

    try {
        await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ title, type, description })
        });

        form.reset();
        loadTasks();
    } catch (err) {
        console.error(err);
    }
});

async function deleteTask(id) {
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
    window.location.href = "login.html";
}

loadTasks();