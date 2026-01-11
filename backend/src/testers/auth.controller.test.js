import httpMocks from "node-mocks-http";
import AuthController from "../../controllers/AuthController.js";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../models/User.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {

    test("register → 201", async () => {
        const req = httpMocks.createRequest({
            body: { username: "u", email: "e@test.com", password: "pass" }
        });
        const res = httpMocks.createResponse();

        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue("hashed");
        User.create.mockResolvedValue({});

        await AuthController.register(req, res);

        expect(res.statusCode).toBe(201);
    });

    test("login → success", async () => {
        const req = httpMocks.createRequest({
            body: { email: "e@test.com", password: "pass" }
        });
        const res = httpMocks.createResponse();

        User.findOne.mockResolvedValue({
            id: 1,
            password: "hashed",
            username: "u",
            email: "e@test.com"
        });

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("token");

        await AuthController.login(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData().token).toBe("token");
    });
});
