import { Task, Subject } from "../models/index.js";

const TaskService = {
    async getTasks(userId) {
        return Task.FindAll({
            where: { userId },
            order: [["due", "ASC"]]
        });
    }, 

    async getTaskById(userId, taskId) {
        return Task.findOne({
            where: { id: taskId, userId }
        });
    },

    async createTask(userId, data) {
        const {
            type,
            title,
            description,
            due,
            timeForCompletion,
            importance,
            subjectId
        } = data;

        if (!type || !title) {
            throw new Error("Task type and title are required.");
        }

        if (subjectId) {
            const subject = await Subject.findOne({
                where: { id: subjectId, userId }
            });
            if(!subject) {
                throw new Error("Invalid subject for this user.");
            }
        }

        return Task.create({
            userId,
            subjectId: subjectId || null,
            type,
            title,
            description: description || null,
            due: due || null,
            timeForCompletion: timeForCompletion || null,
            importance: importance || null
        });
    },

    async updateTask(userId, taskId, data) {
        const task = await Task.findOne({ where: { id: taskId, userId } });
        if (!task) {
            throw new Error("Task not found or you do not have permission.");
        }

        if (data.subjectId) {
            const subject = await Subject.findOne({
            where: { id: data.subjectId, userId }
        });
        if (!subject) {
            throw new Error("Invalid subject for this user.");
        }
    }

    await task.update(data);
    return task;
    },

    async deleteTask(userId, taskId) {
        const deletedCount = await Task.destroy({
            where: { id: taskId, userId }
        });

        if (deletedCount == 0) {
             throw new Error("Task not found or you do not have permission.");
        }
    }
};

export default TaskService;