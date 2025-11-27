import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = "supersecretkey";

async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        return res.json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export default {
    register,
    login
};
