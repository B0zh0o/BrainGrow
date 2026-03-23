import PomodoroService from "../services/PomodoroService.js";

const PomodoroController = {
    async getSettings(req, res) {
        try {
            const settings = await PomodoroService.getSettings(req.user.id);
            res.json(settings);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async createSetting(req, res) {
        try {
            const setting = await PomodoroService.createSetting(req.user.id, req.body);
            res.status(201).json(setting);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteSetting(req, res) {
        try {
            const success = await PomodoroService.deleteSetting(req.user.id, req.params.id);
            if (!success) return res.status(404).json({ message: "Not found" });
            res.json({ message: "Deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async completeSession(req, res) {
        try {
            const total = await PomodoroService.incrementSessions(req.user.id);
            res.json({ message: "Session saved!", totalSessions: total });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default PomodoroController;