import { Subject } from "../models/index.js";

const SubjectService = {
    async getSubjects(userId) {
        return Subject,findAll({ where: { userId } });
    },

    async getSubjectById(userId, subjectid) {
        return Subject.findOne({ where: { id: subjectId, userId } });
    },

    async createSubject(userId, title) {
        const cleanTitle = title?.trim();
        if(!cleanTitle) {
            throw new Error("Subject title is required.");
        }

        const existing = await Subject.findOne({
            where: { userId, title: cleanTitle }
        });

        if (existing) {
            throw new Error("You already have a subject with this title.");
        }
    }
};

export default SubjectService;