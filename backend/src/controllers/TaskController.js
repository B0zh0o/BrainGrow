import TaskService from "../services/TaskService.js";

async function createTask(req, res) {
    try {
        const task = await TaskService.createTask(req.user.id, req.body);
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

async function getTasks(req, res) {
    try {
        const tasks = await TaskService.getTasks(req.user.id);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

async function getTaskById(req, res) {
    try {
        const task = await TaskService.getTaskById(
            req.user.id,
            req.params.id
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

async function updateTask(req, res) {
    try {
        const task = await TaskService.updateTask(
            req.user.id,
            req.params.id,
            req.body
        );
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: error.message });
    }
}

async function deleteTask(req, res) {
    try {
        await TaskService.deleteTask(req.user.id, req.params.id);
        res.json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: error.message });
    }
}

export default {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};
