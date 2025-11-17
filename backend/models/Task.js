import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Task = sequelize.define("Task", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },

    type: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },

    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    due: {
        type: DataTypes.DATE,
        allowNull: true
    },

    timeForCompletion: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    importance: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

export default Task;