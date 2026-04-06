import httpMocks from "node-mocks-http";
import TaskController from "../../controllers/TaskController.js";
import TaskService from "../../services/TaskService.js";

jest.mock("../../services/TaskService.js");

describe("Task Controller", () => {
    const userId = 1;

    test("createTask → 201", async () => {
        const req = httpMocks.createRequest({
            body: { title: "Study" },
            user: { id: userId }
        });
        const res = httpMocks.createResponse();

        TaskService.createTask.mockResolvedValue(req.body);

        await TaskController.createTask(req, res);

        expect(res.statusCode).toBe(201);
    });

    test("getTasks → 200", async () => {
        const req = httpMocks.createRequest({ user: { id: userId } });
        const res = httpMocks.createResponse();

        TaskService.getTasks.mockResolvedValue([]);

        await TaskController.getTasks(req, res);

        expect(res.statusCode).toBe(200);
    });

    test("updateTask → 200", async () => {
        const req = httpMocks.createRequest({
            params: { id: 1 },
            body: { title: "Updated" },
            user: { id: userId }
        });
        const res = httpMocks.createResponse();

        TaskService.updateTask.mockResolvedValue(req.body);

        await TaskController.updateTask(req, res);

        expect(res.statusCode).toBe(200);
    });

    test("deleteTask → 200", async () => {
        const req = httpMocks.createRequest({
            params: { id: 1 },
            user: { id: userId }
        });
        const res = httpMocks.createResponse();

        TaskService.deleteTask.mockResolvedValue();

        await TaskController.deleteTask(req, res);

        expect(res.statusCode).toBe(200);
    });
});
