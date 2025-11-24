// models/index.js (for example)
import User from "./User";
import Task from "./Task";
import FlashCard from "./FlashCard";
import Subject from "./Subject";

User.hasMany(Task, { foreignKey: "userId", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "userId" });

User.hasMany(FlashCard, { foreignKey: "userId", onDelete: "CASCADE" });
FlashCard.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Subject, { foreignKey: "userId", onDelete: "CASCADE" });
Subject.belongsTo(User, { foreignKey: "userId" });

Subject.hasMany(Task, { foreignKey: "subjectId" });
Task.belongsTo(Subject, { foreignKey: "subjectId" });

Subject.hasMany(FlashCard, { foreignKey: "subjectId" });
FlashCard.belongsTo(Subject, { foreignKey: "subjectId" });

export { User, Task, FlashCard, Subject };
