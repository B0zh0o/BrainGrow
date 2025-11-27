import express from "express";
import taskController from "../controllers/TaskController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, taskController.getTasks);
router.get("/:id", auth, taskController.getTaskById);
router.post("/", auth, taskController.createTask);
router.put("/:id", auth, taskController.updateTask);
router.delete("/:id", auth, taskController.deleteTask);

export default router;
