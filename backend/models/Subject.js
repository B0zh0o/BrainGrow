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


// class User{

//     static currentId = 1;

//     constructor(email, password, username){
//         this.id = null;
//         this.email = email;
//         this.password = password;
//         this.username = username;
//     }
// }

export default Subject;