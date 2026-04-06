import "dotenv/config";
import express from "express";
import cors from "cors";
import sequelize from "./db.js";

import "./models/index.js";

import userRoutes         from "./routes/UserRoutes.js";
import subjectRoutes      from "./routes/SubjectRoutes.js";
import taskRoutes         from "./routes/TaskRoutes.js";
import flashcardRoutes    from "./routes/FlashCardRoutes.js";
import pomodoroTimerRoutes from "./routes/PomodoroTimerRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth",       userRoutes);
app.use("/subjects",   subjectRoutes);
app.use("/tasks",      taskRoutes);
app.use("/flashcards", flashcardRoutes);
app.use("/pomodoros",  pomodoroTimerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected.");
    await sequelize.sync({ alter: true });
    console.log("✅ DB synced.");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Could not start server:", err);
    process.exit(1);
  }
}

startServer();
