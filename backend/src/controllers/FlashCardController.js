import FlashCardService from "../services/flashcardService.js";

async function createFlashCard(req, res) {
    try {
        const flashcard = await FlashCardService.createFlashCard(
            req.user.id,
            req.body
        );
        res.status(201).json(flashcard);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

async function getFlashCards(req, res) {
    try {
        const flashcards = await FlashCardService.getFlashCards(req.user.id);
        res.json(flashcards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

async function getFlashCardById(req, res) {
    try {
        const flashcard = await FlashCardService.getFlashCardById(
            req.user.id,
            req.params.id
        );

        if (!flashcard) {
            return res.status(404).json({ message: "Flashcard not found." });
        }

        res.json(flashcard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

async function updateFlashCard(req, res) {
    try {
        const flashcard = await FlashCardService.updateFlashCard(
            req.user.id,
            req.params.id,
            req.body
        );
        res.json(flashcard);
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: error.message });
    }
}

async function deleteFlashCard(req, res) {
    try {
        await FlashCardService.deleteFlashCard(req.user.id, req.params.id);
        res.json({ message: "Flashcard deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: error.message });
    }
}

export default {
    createFlashCard,
    getFlashCards,
    getFlashCardById,
    updateFlashCard,
    deleteFlashCard
};
