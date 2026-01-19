import express from "express";
import flashcardController from "../controllers/FlashCardController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, flashcardController.getFlashCards);
router.get("/:id", auth, flashcardController.getFlashCardById);
router.post("/", auth, flashcardController.createFlashCard);
router.put("/:id", auth, flashcardController.updateFlashCard);
router.delete("/:id", auth, flashcardController.deleteFlashCard);

export default router;
