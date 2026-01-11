import httpMocks from "node-mocks-http";
import FlashCardController from "../../controllers/FlashCardController.js";
import FlashCardService from "../../services/FlashCardService.js";

jest.mock("../../services/FlashCardService.js");

describe("FlashCard Controller", () => {
    const userId = 1;

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("createFlashCard → 201", async () => {
        const req = httpMocks.createRequest({
            body: { question: "Q", answer: "A" },
            user: { id: userId }
        });
        const res = httpMocks.createResponse();

        FlashCardService.createFlashCard.mockResolvedValue(req.body);

        await FlashCardController.createFlashCard(req, res);

        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual(req.body);
    });

    test("getFlashCards → 200", async () => {
        const req = httpMocks.createRequest({ user: { id: userId } });
        const res = httpMocks.createResponse();

        FlashCardService.getFlashCards.mockResolvedValue([]);

        await FlashCardController.getFlashCards(req, res);

        expect(res.statusCode).toBe(200);
    });

    test("getFlashCardById → 404 if not found", async () => {
        const req = httpMocks.createRequest({
            params: { id: 1 },
            user: { id: userId }
        });
        const res = httpMocks.createResponse();

        FlashCardService.getFlashCardById.mockResolvedValue(null);

        await FlashCardController.getFlashCardById(req, res);

        expect(res.statusCode).toBe(404);
    });

    test("updateFlashCard → 200", async () => {
        const req = httpMocks.createRequest({
            params: { id: 1 },
            body: { question: "Updated" },
            user: { id: userId }
        });
        const res = httpMocks.createResponse();

        FlashCardService.updateFlashCard.mockResolvedValue(req.body);

        await FlashCardController.updateFlashCard(req, res);

        expect(res.statusCode).toBe(200);
    });

    test("deleteFlashCard → 200", async () => {
        const req = httpMocks.createRequest({
            params: { id: 1 },
            user: { id: userId }
        });
        const res = httpMocks.createResponse();

        FlashCardService.deleteFlashCard.mockResolvedValue();

        await FlashCardController.deleteFlashCard(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData().message).toContain("deleted");
    });
});
