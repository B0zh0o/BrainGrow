import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const FlashCard = sequelize.define("FlashCard", {
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

    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Title cannot be empty."
            },
            len: {
                args: [2, 255],
            msg: "Title must be between 2 and 255 characters."
            }
        }
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate : {
            notEmpty: {
                msg: "Content cannot be empty."
            },
            len: {
                args: [3, 5000],
                msg: "Content must be between 3 and 5000 characters."
            }
        }
    },

    answer: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 2000],
                msg: "Answer must be under 2000 characters."
            }
        }
    }

// }, {
//   timestamps: true,
//    tableName: "Flashcards"
});

export default FlashCard;