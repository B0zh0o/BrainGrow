import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// Auth
router.post("/register", UserController.register);
router.post("/login",    UserController.login);
router.get("/me",        auth, UserController.me);

// CRUD
router.get("/",          UserController.getAll);
router.get("/:id",       UserController.getOne);
router.put("/:id",       UserController.update);
router.delete("/:id",    UserController.remove);

export default router;
