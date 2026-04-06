import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const PomodoroTimer = sequelize.define("PomodoroTimer", {
    label: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "Default"
    },
    workTime: {
        type: DataTypes.INTEGER,
        defaultValue: 40,
        allowNull: false
    },
    breakTime: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default PomodoroTimer;