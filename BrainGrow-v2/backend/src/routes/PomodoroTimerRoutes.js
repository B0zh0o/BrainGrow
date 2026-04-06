import { Router } from "express";
import PomodoroController from "../controllers/PomodoroController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/",           auth, PomodoroController.getSettings);
router.post("/",          auth, PomodoroController.createSetting);
router.post("/complete",  auth, PomodoroController.completeSession); // MUST be before /:id
router.delete("/:id",     auth, PomodoroController.deleteSetting);

export default router;
