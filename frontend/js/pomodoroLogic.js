const settingsList = document.getElementById("settingsList");
const timeDisplay = document.getElementById("time");
const modeDisplay = document.getElementById("mode");
const sessionCountDisplay = document.getElementById("sessionCount");
const statusMessage = document.getElementById("statusMessage");

let currentWork = 40;
let currentBreak = 10;
let seconds = currentWork * 60;
let timer;
let isRunning = false;
let isWorkMode = true;

const sound = new Audio("../resources/sounds/notification.mp3");
const API_URL = "http://localhost:3000";

async function loadData() {
    try {
        const res = await fetch(API_URL + "/pomodoros", {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        });
        const settings = await res.json();
        settingsList.innerHTML = "";

        settings.forEach(s => {
            const box = document.createElement("div");
            box.className = "setting-box";
            box.innerHTML = `
                <span>${s.label} (${s.workTime}/${s.breakTime})</span>
                <button data-id="${s.id}">X</button>
            `;

            box.onclick = (e) => {
                if (e.target.tagName === "BUTTON") return;
                currentWork = s.workTime;
                currentBreak = s.breakTime;
                resetTimer();
            };

            box.querySelector("button").onclick = async (e) => {
                e.stopPropagation();
                await fetch(API_URL + "/pomodoros/" + s.id, {
                    method: "DELETE",
                    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                });
                loadData();
            };
            settingsList.appendChild(box);
        });

        const userRes = await fetch(API_URL + "/auth/me", {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const user = await userRes.json();
        sessionCountDisplay.textContent = user.totalSessions;
    } catch (err) { console.error("Load error:", err); }
}

document.getElementById("addSetting").onclick = async () => {
    const label = document.getElementById("labelInput").value;
    const workTime = document.getElementById("workInput").value;
    const breakTime = document.getElementById("breakInput").value;

    await fetch(API_URL + "/pomodoros", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ label, workTime, breakTime })
    });
    loadData();
};

function updateDisplay() {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    timeDisplay.textContent = `${min}:${sec.toString().padStart(2, "0")}`;
}

function switchMode() {
    sound.play();
    if (isWorkMode) {
        seconds = currentBreak * 60;
        modeDisplay.textContent = "Break";
        statusMessage.textContent = "Take a break!";
    } else {
        seconds = currentWork * 60;
        modeDisplay.textContent = "Work";
        statusMessage.textContent = "Time for work!";
    }
    isWorkMode = !isWorkMode;
}

async function completeSession() {
    const res = await fetch(API_URL + "/pomodoros/complete", {
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });
    const data = await res.json();
    sessionCountDisplay.textContent = data.totalSessions;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    if (statusMessage) statusMessage.textContent = "";

    updateDisplay();

    timer = setInterval(async () => {
        seconds--;
        updateDisplay();

        if (seconds <= 0) {
            clearInterval(timer);
            isRunning = false;
            if (isWorkMode) {
                await completeSession();
            }
            switchMode();
            updateDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    pauseTimer();
    isWorkMode = true;
    seconds = currentWork * 60;
    modeDisplay.textContent = "Work";
    if (statusMessage) statusMessage.textContent = "Get ready!";
    updateDisplay();
}

document.getElementById("start").onclick = startTimer;
document.getElementById("pause").onclick = pauseTimer;
document.getElementById("reset").onclick = resetTimer;

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = 'login.html';
});

updateDisplay();
loadData();
