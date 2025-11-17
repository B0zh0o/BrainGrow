import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const FlashCard = sequelize.define("FlashCard", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },

    title: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    answer: {
        type: DataTypes.TEXT,
        allowNull: true
    }

});

export default FlashCard;