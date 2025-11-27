import { FlashCard, Subject } from "../models/index.js";

const FlashCardService = {
  async getFlashCards(userId) {
    return FlashCard.findAll({
      where: { userId }
    });
  },

  async getFlashCardById(userId, flashCardId) {
    return FlashCard.findOne({
      where: { id: flashCardId, userId }
    });
  },

  async createFlashCard(userId, data) {
    const { title, content, answer, subjectId } = data;

    if (!title || !content) {
      throw new Error("Title and content are required.");
    }

    if (subjectId) {
      const subject = await Subject.findOne({
        where: { id: subjectId, userId }
      });
      if (!subject) {
        throw new Error("Invalid subject for this user.");
      }
    }

    return FlashCard.create({
      userId,
      subjectId: subjectId || null,
      title,
      content,
      answer: answer || null
    });
  },

  async updateFlashCard(userId, flashCardId, data) {
    const flashcard = await FlashCard.findOne({
      where: { id: flashCardId, userId }
    });

    if (!flashcard) {
      throw new Error("Flashcard not found or you do not have permission.");
    }

    if (data.subjectId) {
      const subject = await Subject.findOne({
        where: { id: data.subjectId, userId }
      });
      if (!subject) {
        throw new Error("Invalid subject for this user.");
      }
    }

    await flashcard.update(data);
    return flashcard;
  },

  async deleteFlashCard(userId, flashCardId) {
    const deletedCount = await FlashCard.destroy({
      where: { id: flashCardId, userId }
    });

    if (deletedCount === 0) {
      throw new Error("Flashcard not found or you do not have permission.");
    }
  }
};

export default FlashCardService;
