import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Subject = sequelize.define("Subject", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: "uniqueUserSubject",
    },

    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: "uniqueUserSubject",
        validate: {
            notEmpty: {
                msg: "Subject title cannot be empty."
            },
            len: {
                args: [2, 255],
                msg: "Subject title must be between 2 and 255 characters."
            }
        }
    }
});

export default Subject;