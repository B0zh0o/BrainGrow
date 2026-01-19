import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserService from "../services/UserService.js";

const JWT_SECRET = "supersecretkey";

const UserController = {
  //AUTH
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const created = await UserService.createUser({
        username,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        message: "User registered successfully.",
        user: { id: created.id, username: created.username, email: created.email },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      const user = await UserService.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "30d" });

      return res.json({
        message: "Login successful.",
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // CRUD
  async create(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "username, email, password are required." });
      }

      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserService.createUser({
        username,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const users = await UserService.getUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  async getOne(req, res) {
    try {
      const { id } = req.params;

      const user = await UserService.getUserById(Number(id));
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const updated = await UserService.updateUser(Number(id), data);
      if (!updated) {
        return res.status(404).json({ message: "User not found." });
      }

      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;

      const deleted = await UserService.deleteUser(Number(id));
      if (!deleted) {
        return res.status(404).json({ message: "User not found." });
      }

      return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },
};

export default UserController;
