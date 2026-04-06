const API = "http://localhost:3000";

function getToken()      { return localStorage.getItem("token"); }
function authHeaders()   { return { "Content-Type": "application/json", "Authorization": "Bearer " + getToken() }; }

// ── Guard ──────────────────────────────────────────
if (!getToken()) window.location.href = "login.html";

// ── Sanitize to prevent XSS ────────────────────────
function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Load tasks ─────────────────────────────────────
async function loadTasks() {
  const list = document.getElementById("taskList");

  try {
    const res = await fetch(`${API}/tasks`, { headers: authHeaders() });

    if (res.status === 401 || res.status === 403) {
      window.location.href = "login.html";
      return;
    }

    const tasks = await res.json();
    list.innerHTML = "";

    if (!tasks.length) {
      list.innerHTML = '<div class="empty-state">Няма задачи. Добави първата! 🎯</div>';
      return;
    }

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.innerHTML = `
        <div class="task-info">
          <div class="task-type-badge">${esc(task.type)}</div>
          <div class="task-title">${esc(task.title)}</div>
          ${task.due ? `<div class="task-meta">📅 ${new Date(task.due).toLocaleDateString("bg-BG")}</div>` : ""}
          ${task.description ? `<div class="task-desc">${esc(task.description)}</div>` : ""}
        </div>
        <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">🗑</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = '<div class="empty-state">Грешка при зареждане. Работи ли сървърът?</div>';
  }
}

// ── Add task ───────────────────────────────────────
async function addTask() {
  const title       = document.getElementById("title").value.trim();
  const type        = document.getElementById("type").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title || !type) { showToast("Попълни заглавие и тип."); return; }

  const btn = document.querySelector(".btn-primary");
  btn.textContent = "Добавяне…";
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title, type, description })
    });

    if (!res.ok) { const e = await res.json(); showToast(e.message); return; }

    document.getElementById("title").value       = "";
    document.getElementById("type").value        = "";
    document.getElementById("description").value = "";
    loadTasks();
    showToast("Задачата е добавена ✓", "success");
  } catch {
    showToast("Грешка при свързване.");
  } finally {
    btn.textContent = "+ Добави задача";
    btn.disabled = false;
  }
}

// ── Delete task ────────────────────────────────────
async function deleteTask(id) {
  if (!confirm("Изтриване на задачата?")) return;
  try {
    const res = await fetch(`${API}/tasks/${id}`, { method: "DELETE", headers: authHeaders() });
    if (!res.ok) { const e = await res.json(); showToast(e.message); return; }
    loadTasks();
    showToast("Задачата е изтрита.", "success");
  } catch {
    showToast("Грешка при изтриване.");
  }
}

// ── Logout ─────────────────────────────────────────
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// ── Toast ──────────────────────────────────────────
function showToast(msg, type = "error") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    Object.assign(toast.style, {
      position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
      padding: "12px 20px", borderRadius: "10px", fontSize: "13px",
      fontFamily: "Sora, sans-serif", fontWeight: "600",
      zIndex: "9999", transition: "opacity 0.3s", pointerEvents: "none"
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.background = type === "success" ? "rgba(16,217,140,0.15)" : "rgba(255,79,106,0.15)";
  toast.style.border     = type === "success" ? "1px solid rgba(16,217,140,0.3)" : "1px solid rgba(255,79,106,0.3)";
  toast.style.color      = type === "success" ? "#10d98c" : "#ff4f6a";
  toast.style.opacity    = "1";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = "0"; }, 3000);
}

// ── Init ───────────────────────────────────────────
loadTasks();
