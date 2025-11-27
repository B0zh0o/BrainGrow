import express from "express";
import subjectController from "../controllers/SubjectController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, subjectController.getSubjects);
router.get("/:id", auth, subjectController.getSubjectById);
router.post("/", auth, subjectController.createSubject);
router.delete("/:id", auth, subjectController.deleteSubject);

export default router;
