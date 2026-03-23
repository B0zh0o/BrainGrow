const settingsList = document.getElementById("settingsList");
const timeDisplay = document.getElementById("time");
const modeDisplay = document.getElementById("mode");
const sessionCountDisplay = document.getElementById("sessionCount");

let currentWork = 40;
let currentBreak = 10;
let seconds = currentWork * 60;
let timer;
let isRunning = false;
let isWorkMode = true;

const sound = new Audio("/sounds/notification.mp3");

/* LOAD SETTINGS + USER */
async function loadData() {
    // SETTINGS
    const res = await fetch("http://localhost:3000/pomodoros", {
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

        // SELECT
        box.onclick = (e) => {
            if (e.target.tagName === "BUTTON") return;

            currentWork = s.workTime;
            currentBreak = s.breakTime;
            resetTimer();
        };

        // DELETE
        box.querySelector("button").onclick = async () => {
            await fetch("http://localhost:3000/pomodoros" + s.id, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
            loadData();
        };

        settingsList.appendChild(box);
    });

    // USER (session count)
    const userRes = await fetch("/auth/me", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });

    const user = await userRes.json();
    sessionCountDisplay.textContent = user.totalSessions;
}

/* ADD PRESET */
document.getElementById("addSetting").onclick = async () => {
    const label = document.getElementById("labelInput").value;
    const workTime = document.getElementById("workInput").value;
    const breakTime = document.getElementById("breakInput").value;

    await fetch("http://localhost:3000/pomodoros", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ label, workTime, breakTime })
    });

    loadData();
};

/* TIMER */
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
    } else {
        seconds = currentWork * 60;
        modeDisplay.textContent = "Work";
    }

    isWorkMode = !isWorkMode;
}

async function completeSession() {
    const res = await fetch("/pomodoros/complete", {
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });

    const data = await res.json();
    sessionCountDisplay.textContent = data.totalSessions;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;

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
            startTimer(); // auto start next
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
    updateDisplay();
}

/* EVENTS */
document.getElementById("start").onclick = startTimer;
document.getElementById("pause").onclick = pauseTimer;
document.getElementById("reset").onclick = resetTimer;

/* INIT */
localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc0MjQ2NTI3LCJleHAiOjE3NzY4Mzg1Mjd9.cNkvXoYEzKdXzEkYP1nY-Pz0Wmnui6F-rzkpGVrJ978");
updateDisplay();
loadData();