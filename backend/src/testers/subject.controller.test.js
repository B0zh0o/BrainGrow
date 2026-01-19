import httpMocks from "node-mocks-http";
import SubjectController from "../../controllers/SubjectController.js";
import SubjectService from "../../services/SubjectService.js";

jest.mock("../../services/SubjectService.js");

describe("Subject Controller", () => {
    const userId = 1;

    test("getSubjects → 200", async () => {
        const req = httpMocks.createRequest({ user: { id: userId } });
        const res = httpMocks.createResponse();

        SubjectService.getSubjects.mockResolvedValue([]);

        await SubjectController.getSubjects(req, res);

        expect(res.statusCode).toBe(200);
    });

    test("getSubjectById → 404", async () => {
        const req = httpMocks.createRequest({
            params: { id: 1 },
            user: { id: userId }
        });
        const res = httpMocks.createResponse();

        SubjectService.getSubjectById.mockResolvedValue(null);

        await SubjectController.getSubjectById(req, res);

        expect(res.statusCode).toBe(404);
    });

    test("createSubject → 201", async () => {
        const req = httpMocks.createRequest({
            body: { title: "Math" },
            user: { id: userId }
        });
        const res = httpMocks.createResponse();

        SubjectService.createSubject.mockResolvedValue(req.body);

        await SubjectController.createSubject(req, res);

        expect(res.statusCode).toBe(201);
    });

    test("deleteSubject → 200", async () => {
        const req = httpMocks.createRequest({
            params: { id: 1 },
            user: { id: userId }
        });
        const res = httpMocks.createResponse();

        SubjectService.deleteSubject.mockResolvedValue();

        await SubjectController.deleteSubject(req, res);

        expect(res.statusCode).toBe(200);
    });
});
