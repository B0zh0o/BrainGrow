import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { auth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.post("/", UserController.create);
router.get("/", UserController.getAll);
router.get("/:id", UserController.getOne);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.remove);

router.get("/me", auth, async (req, res) => {
    const user = await User.findByPk(req.user.id);
    res.json(user);
});

export default router;
