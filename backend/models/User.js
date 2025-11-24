import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },

    username: {
        type: DataTypes.STRING(35),
        allowNull: false,
        unique: true
    },

    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    }

});

export default User;