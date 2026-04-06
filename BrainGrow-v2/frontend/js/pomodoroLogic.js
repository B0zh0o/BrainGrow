const API = "http://localhost:3000";
function getToken() { return localStorage.getItem("token"); }
function authH()    { return { "Content-Type": "application/json", "Authorization": "Bearer " + getToken() }; }

// ── Guard ──────────────────────────────────────────
if (!getToken()) window.location.href = "login.html";

// ── DOM refs ───────────────────────────────────────
const timeDisplay        = document.getElementById("time");
const modeDisplay        = document.getElementById("mode");
const statusMessage      = document.getElementById("statusMessage");
const sessionCountDisplay= document.getElementById("sessionCount");
const settingsList       = document.getElementById("settingsList");

// ── State ──────────────────────────────────────────
let currentWork  = 40;
let currentBreak = 10;
let seconds      = currentWork * 60;
let timer        = null;
let isRunning    = false;
let isWorkMode   = true;

const sound = new Audio("../resources/sounds/notification.mp3");

// ── Load presets + session count ───────────────────
async function loadData() {
  try {
    const res = await fetch(`${API}/pomodoros`, { headers: authH() });
    if (res.status === 401 || res.status === 403) { window.location.href = "login.html"; return; }

    const settings = await res.json();
    settingsList.innerHTML = "";

    if (!settings.length) {
      settingsList.innerHTML = '<div style="font-size:13px;color:var(--muted);text-align:center;padding:16px 0">Няма запазени пресети.</div>';
    }

    settings.forEach(s => {
      const box = document.createElement("div");
      box.className = "preset-item";
      box.innerHTML = `
        <span>${s.label} · <span style="font-family:'JetBrains Mono',monospace;font-size:12px">${s.workTime}/${s.breakTime} мин</span></span>
        <button class="btn btn-danger btn-sm" data-id="${s.id}">✕</button>
      `;

      // Click preset to activate
      box.addEventListener("click", e => {
        if (e.target.closest("button")) return;
        currentWork  = s.workTime;
        currentBreak = s.breakTime;
        resetTimer();
        showToast(`Пресет "${s.label}" активиран.`, "success");
      });

      // Delete preset
      box.querySelector("button").addEventListener("click", async e => {
        e.stopPropagation();
        await fetch(`${API}/pomodoros/${s.id}`, { method: "DELETE", headers: authH() });
        loadData();
      });

      settingsList.appendChild(box);
    });

    // Load session count
    try {
      const userRes = await fetch(`${API}/auth/me`, { headers: authH() });
      if (userRes.ok) {
        const user = await userRes.json();
        if (user.totalSessions !== undefined) sessionCountDisplay.textContent = user.totalSessions;
      }
    } catch {}

  } catch (err) {
    console.error("Load error:", err);
  }
}

// ── Add preset ─────────────────────────────────────
document.getElementById("addSetting").addEventListener("click", async () => {
  const label     = document.getElementById("labelInput").value.trim();
  const workTime  = parseInt(document.getElementById("workInput").value);
  const breakTime = parseInt(document.getElementById("breakInput").value);

  if (!label || !workTime || !breakTime || workTime < 1 || breakTime < 1) {
    showToast("Попълни валидни стойности за всички полета.");
    return;
  }

  await fetch(`${API}/pomodoros`, {
    method: "POST",
    headers: authH(),
    body: JSON.stringify({ label, workTime, breakTime })
  });

  document.getElementById("labelInput").value = "";
  document.getElementById("workInput").value  = "";
  document.getElementById("breakInput").value = "";

  loadData();
  showToast(`Пресет "${label}" запазен ✓`, "success");
});

// ── Timer logic ────────────────────────────────────
function updateDisplay() {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  timeDisplay.textContent = `${min}:${sec.toString().padStart(2, "0")}`;
}

function switchMode() {
  sound.play().catch(() => {});
  if (isWorkMode) {
    seconds               = currentBreak * 60;
    modeDisplay.textContent  = "ПОЧИВКА";
    statusMessage.textContent = "Почини си! ☕";
    modeDisplay.style.color   = "var(--green)";
  } else {
    seconds               = currentWork * 60;
    modeDisplay.textContent  = "РАБОТА";
    statusMessage.textContent = "Време за работа! 💪";
    modeDisplay.style.color   = "var(--accent)";
  }
  isWorkMode = !isWorkMode;
}

async function completeSession() {
  try {
    const res = await fetch(`${API}/pomodoros/complete`, { method: "POST", headers: authH() });
    if (res.ok) {
      const data = await res.json();
      if (data.totalSessions !== undefined) {
        sessionCountDisplay.textContent = data.totalSessions;
        showToast(`Сесия #${data.totalSessions} завършена! 🎉`, "success");
      }
    }
  } catch {}
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  statusMessage.textContent = "";

  timer = setInterval(async () => {
    seconds--;
    updateDisplay();

    if (seconds <= 0) {
      clearInterval(timer);
      timer = null;
      isRunning = false;
      if (isWorkMode) await completeSession();
      switchMode();
      updateDisplay();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
  isRunning = false;
  statusMessage.textContent = "Пауза…";
}

function resetTimer() {
  pauseTimer();
  isWorkMode                = true;
  seconds                   = currentWork * 60;
  modeDisplay.textContent   = "РАБОТА";
  modeDisplay.style.color   = "var(--accent)";
  statusMessage.textContent = "Готов?";
  updateDisplay();
}

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
      position:"fixed", bottom:"24px", left:"50%", transform:"translateX(-50%)",
      padding:"12px 20px", borderRadius:"10px", fontSize:"13px",
      fontFamily:"Sora,sans-serif", fontWeight:"600",
      zIndex:"9999", transition:"opacity 0.3s", pointerEvents:"none"
    });
    document.body.appendChild(toast);
  }
  toast.textContent      = msg;
  toast.style.background = type === "success" ? "rgba(16,217,140,0.15)" : "rgba(255,79,106,0.15)";
  toast.style.border     = type === "success" ? "1px solid rgba(16,217,140,0.3)" : "1px solid rgba(255,79,106,0.3)";
  toast.style.color      = type === "success" ? "#10d98c" : "#ff4f6a";
  toast.style.opacity    = "1";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = "0"; }, 3500);
}

// ── Event bindings ─────────────────────────────────
document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("pause").addEventListener("click", pauseTimer);
document.getElementById("reset").addEventListener("click", resetTimer);

// ── Init ───────────────────────────────────────────
updateDisplay();
loadData();
