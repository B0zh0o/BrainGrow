import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Task = sequelize.define("Task", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Task type cannot be empty."},
            len: {
                args: [2, 50],
                msg: "Task type must be between 2 and 50 characters."
            } 
        }
    },

    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Title cannot be empty." },
            len: {
                args: [3, 255],
                msg: "Title must be between 3 and 255 characters."
            }
        }
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 5000],
                msg: "Description must be under 5000 characters."
            }
        }
    },

    due: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: { msg: "Due date must be a valid date." }
        }
    },

    timeForCompletion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: [1],
                msg: "Time for completion must be at least 1 minute."
            },
            max: {
                args: [1440],
                msg: "Time for completion cannot exceed 1440 minutes (1 day)."
            }
        }
    },

    importance: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: [1],
                msg: "Importance must be at least 1."
            },
            max: {
                args: [5],
                msg: "Importance cannot be greater than 5."
            }
        }
    }
});

export default Task;