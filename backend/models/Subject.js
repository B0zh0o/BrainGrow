import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Subject = sequelize.define("Subject", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },

    title: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});


export default Subject;