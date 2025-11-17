import User from "./User";
import Task from "./Task";
import FlashCard from "./FlashCard";
import Subject from "./Subject";

User.hasMany(Task, {foreignKey: "userId"});
Task.belongsTo(User, {foreignKey: "userId"});

User.hasMany(FlashCard, {foreignKey: "userId"});
FlashCard.belongsTo(User, {foreignKey: "userId"});

Task.belongsToMany(Subject, {through: "TaskSubject", foreignKey: "subjectId"} );
Subject.belongsToMany(Task, {through: "TaskSubject", foreignKey: "taskId"} );

FlashCard.belongsToMany(Subject, {through: "FlashCardSubject", foreignKey: "subjectId"} );
Subject.belongsToMany(FlashCard, {through: "FlashCardSubject", foreignKey: "flashCardId"} );