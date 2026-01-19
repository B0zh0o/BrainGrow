import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.post("/", UserController.create);
router.get("/", UserController.getAll);
router.get("/:id", UserController.getOne);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.remove);

export default router;
