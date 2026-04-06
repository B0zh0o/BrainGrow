import PomodoroTimer from "../models/PomodoroTimer.js";
import User from "../models/User.js";

const PomodoroService = {
    async getSettings(userId) {
        return await PomodoroTimer.findAll({ where: { userId } });
    },

    async createSetting(userId, data) {
        const { label, workTime, breakTime } = data;
        return await PomodoroTimer.create({
            label,
            workTime,
            breakTime,
            userId
        });
    },

    async deleteSetting(userId, id) {
        const result = await PomodoroTimer.destroy({ where: { id, userId } });
        return result > 0;
    },

    async incrementSessions(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("User not found");
        
        user.totalSessions += 1;
        await user.save();
        return user.totalSessions;
    }
};

export default PomodoroService;