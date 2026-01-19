import SubjectService from "../services/SubjectService.js";


async function createSubject(req, res) {
    try {
        const { title } = req.body;

        const subject = await SubjectService.createSubject(req.user.id, title);
        res.status(201).json(subject);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

async function getSubjects(req, res) {
    try {
        const subjects = await SubjectService.getSubjects(req.user.id);
        res.json(subjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

async function getSubjectById(req, res) {
    try {
        const subject = await SubjectService.getSubjectById(
            req.user.id,
            req.params.id
        );

        if (!subject) {
            return res.status(404).json({ message: "Subject not found." });
        }

        res.json(subject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

async function deleteSubject(req, res) {
    try {
        await SubjectService.deleteSubject(req.user.id, req.params.id);
        res.json({ message: "Subject deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: error.message });
    }
}

export default {
    getSubjects,
    getSubjectById,
    createSubject,
    deleteSubject
};
