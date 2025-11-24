import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },

    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username cannot be empty.",
        },
        len: {
          args: [3, 50],
          msg: "Username must be between 3 and 50 characters.",
        },
      },
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: "Email already exists.",
      },
      validate: {
        notEmpty: {
          msg: "Email cannot be empty.",
        },
        isEmail: {
          msg: "Email format is invalid.",
        },
      }, 
    }, 

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty.",
        },
        len: {
          args: [8, 255],
          msg: "Password must be at least 8 characters long.",
        },
      },
    },
  },
 // {
  //  timestamps: true,
   // tableName: "Users",
 // }
);

export default User;
