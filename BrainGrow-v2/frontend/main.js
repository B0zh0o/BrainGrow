/* ═══════════════════════════════════════════════════
   BrainGrow — Flashcards JS
   Talks to backend with JWT auth.
   Backend model fields: id, title, content, answer
   Frontend fields:      id, question, answer, category
════════════════════════════════════════════════════ */

const API = "http://localhost:3000";

let cards         = [];
let filteredCards = [];
let currentIndex  = 0;
let correct       = 0;
let wrong         = 0;

// ── Auth helpers ──────────────────────────────────
function getToken() { return localStorage.getItem("token"); }

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  };
}

function requireAuth() {
  if (!getToken()) window.location.href = "login.html";
}

// ── Map backend → frontend ────────────────────────
function mapCard(c) {
  return {
    id:       c.id,
    question: c.title,
    answer:   c.answer ?? c.content,
    category: c.subjectId ? String(c.subjectId) : "Общо"
  };
}

// ── Bootstrap ─────────────────────────────────────
window.onload = async () => {
  requireAuth();
  await loadCards();
  filteredCards = [...cards];
  updateCategories();
  showCard();
};

// ── Load ──────────────────────────────────────────
async function loadCards() {
  try {
    const res = await fetch(`${API}/flashcards`, { headers: authHeaders() });
    if (res.status === 401 || res.status === 403) {
      window.location.href = "login.html";
      return;
    }
    cards = (await res.json()).map(mapCard);
  } catch {
    const saved = localStorage.getItem("flashcards_cache");
    if (saved) cards = JSON.parse(saved);
  }
  // cache locally for offline fallback
  localStorage.setItem("flashcards_cache", JSON.stringify(cards));
}

// ── Display card ──────────────────────────────────
function showCard() {
  const front = document.getElementById("front");
  const back  = document.getElementById("back");

  if (!filteredCards.length) {
    front.childNodes[0].textContent = "Няма карти";
    back.textContent = "";
    document.getElementById("progress").textContent = "0 / 0";
    document.getElementById("progress-fill").style.width = "0%";
    return;
  }

  const card = filteredCards[currentIndex];
  front.childNodes[0].textContent = card.question;
  back.textContent  = card.answer;

  document.getElementById("card").classList.remove("flipped");
  updateProgress();
}

function flipCard() {
  document.getElementById("card").classList.toggle("flipped");
}

// ── Navigation ────────────────────────────────────
function nextCard() {
  if (currentIndex < filteredCards.length - 1) { currentIndex++; showCard(); }
}

function prevCard() {
  if (currentIndex > 0) { currentIndex--; showCard(); }
}

function shuffle() {
  for (let i = filteredCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredCards[i], filteredCards[j]] = [filteredCards[j], filteredCards[i]];
  }
  currentIndex = 0;
  showCard();
}

// ── Progress ──────────────────────────────────────
function updateProgress() {
  const total = filteredCards.length;
  const pos   = total ? currentIndex + 1 : 0;

  document.getElementById("progress").textContent =
    `${pos} / ${total}  ·  ✔ ${correct}  ✘ ${wrong}`;

  const pct = total ? (pos / total) * 100 : 0;
  document.getElementById("progress-fill").style.width = `${pct}%`;
}

function mark(ok) {
  if (ok) correct++; else wrong++;
  nextCard();
  updateProgress();
}

// ── Categories ────────────────────────────────────
function updateCategories() {
  const sel = document.getElementById("categoryFilter");
  sel.innerHTML = `<option value="all">Всички категории</option>`;

  [...new Set(cards.map(c => c.category))].forEach(cat => {
    const o = document.createElement("option");
    o.value = o.textContent = cat;
    sel.appendChild(o);
  });
}

function filterCards() {
  const val = document.getElementById("categoryFilter").value;
  filteredCards = val === "all" ? [...cards] : cards.filter(c => c.category === val);
  currentIndex = 0;
  showCard();
}

// ── Add ───────────────────────────────────────────
async function addCard() {
  const q = document.getElementById("question").value.trim();
  const a = document.getElementById("answer").value.trim();

  if (!q || !a) { showToast("Попълни въпрос и отговор!"); return; }

  try {
    const res = await fetch(`${API}/flashcards`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title: q, content: q, answer: a })
    });

    if (!res.ok) { const e = await res.json(); showToast(e.message); return; }

    const created = await res.json();
    cards.push(mapCard(created));
    filteredCards = [...cards];

    document.getElementById("question").value = "";
    document.getElementById("answer").value   = "";
    document.getElementById("category").value = "";

    localStorage.setItem("flashcards_cache", JSON.stringify(cards));
    updateCategories();
    currentIndex = cards.length - 1;
    showCard();
    showToast("Картата е добавена ✓", "success");
  } catch {
    showToast("Грешка при свързване със сървъра.");
  }
}

// ── Delete ────────────────────────────────────────
async function deleteCard() {
  if (!filteredCards.length) return;
  if (!confirm("Изтриване на текущата карта?")) return;

  const card = filteredCards[currentIndex];

  try {
    const res = await fetch(`${API}/flashcards/${card.id}`, {
      method: "DELETE",
      headers: authHeaders()
    });
    if (!res.ok) { const e = await res.json(); showToast(e.message); return; }

    cards         = cards.filter(c => c.id !== card.id);
    filteredCards = filteredCards.filter(c => c.id !== card.id);

    if (currentIndex >= filteredCards.length) currentIndex = Math.max(0, filteredCards.length - 1);
    localStorage.setItem("flashcards_cache", JSON.stringify(cards));
    updateCategories();
    showCard();
    showToast("Картата е изтрита.", "success");
  } catch {
    showToast("Грешка при изтриване.");
  }
}

// ── Edit (inline prompt — can be upgraded to modal later) ─
async function editCard() {
  if (!filteredCards.length) return;
  const card = filteredCards[currentIndex];

  const q = prompt("Нов въпрос:", card.question);
  const a = prompt("Нов отговор:", card.answer);
  if (!q || !a) return;

  try {
    const res = await fetch(`${API}/flashcards/${card.id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ title: q, content: q, answer: a })
    });
    if (!res.ok) { const e = await res.json(); showToast(e.message); return; }

    const mapped = mapCard(await res.json());

    const ci = cards.findIndex(c => c.id === card.id);
    if (ci !== -1) cards[ci] = mapped;
    const fi = filteredCards.findIndex(c => c.id === card.id);
    if (fi !== -1) filteredCards[fi] = mapped;

    localStorage.setItem("flashcards_cache", JSON.stringify(cards));
    showCard();
    showToast("Картата е обновена ✓", "success");
  } catch {
    showToast("Грешка при редакция.");
  }
}

// ── Logout ────────────────────────────────────────
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// ── Toast notifications (replaces alert()) ────────
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
  toast.style.background = type === "success"
    ? "rgba(16,217,140,0.15)" : "rgba(255,79,106,0.15)";
  toast.style.border = type === "success"
    ? "1px solid rgba(16,217,140,0.3)" : "1px solid rgba(255,79,106,0.3)";
  toast.style.color  = type === "success" ? "#10d98c" : "#ff4f6a";
  toast.style.opacity = "1";

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.opacity = "0"; }, 3000);
}
