import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { auth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.post("/", UserController.create);
router.get("/me", auth, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Невалиден токен" });
        }
        const user = await User.findByPk(req.user.id);
        res.json(user);
    } catch (error) {
        console.error("Грешка в /me маршрута:", error);
        res.status(500).json({ message: "Сървърна грешка" });
    }
});

router.get("/", UserController.getAll);
router.get("/:id", UserController.getOne);
router.put("/:id", UserController.update);
router.delete('/delete-me', auth, UserController.remove);


export default router;
