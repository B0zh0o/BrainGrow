import express from "express";
import sequelize from "./db.js";

import "./models/index.js";

import userRoutes from "./routes/UserRoutes.js";
import subjectRoutes from "./routes/SubjectRoutes.js";
import taskRoutes from "./routes/TaskRoutes.js";
import flashcardRoutes from "./routes/FlashCardRoutes.js";

const app = express();
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/subjects", subjectRoutes);
app.use("/tasks", taskRoutes);
app.use("/flashcards", flashcardRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("DB connected.");

        await sequelize.sync({ alter: true });
        console.log("DB synced.");

        app.listen(PORT, () =>
            console.log(` Server running on http://localhost:${PORT}`)
        );
    } catch (err) {
        console.error("Could not start server:", err);
    }
}

startServer();
