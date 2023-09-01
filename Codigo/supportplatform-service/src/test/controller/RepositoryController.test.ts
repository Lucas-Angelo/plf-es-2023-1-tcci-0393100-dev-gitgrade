import supertest from "supertest";
import app from "../..";
import { generateToken } from "../../config/JwtConfig";
import Database from "../../database";

describe("GET /repository", () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });
    it("should return 422 when search param page is not a number", async () => {
        const response = await supertest(app)
            .get("/repository?page=abc")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.page"]?.message).toBe(
            "page must be an integer"
        );
    });

    it("should return 422 when search param page is lesser than 1", async () => {
        const response = await supertest(app)
            .get("/repository?page=0")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.page"]?.message).toBe(
            "page must be greater than or equal to 1"
        );
    });

    it("should return 422 when search param limit is not a number", async () => {
        const response = await supertest(app)
            .get("/repository?limit=abc")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.limit"]?.message).toBe(
            "limit must be an integer"
        );
    });

    it("should return 422 when search param limit is lesser than 1", async () => {
        const response = await supertest(app)
            .get("/repository?limit=0")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.limit"]?.message).toBe(
            "limit must be greater than or equal to 1"
        );
    });

    it("should return 200 when missing params, and default to limit=10 and page=1", async () => {
        const response = await supertest(app)
            .get("/repository")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when page is 2, and return just 2 repos (the rest)", async () => {
        const response = await supertest(app)
            .get("/repository?page=2")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 and return 5 repos, when limit is 5", async () => {
        const response = await supertest(app)
            .get("/repository?limit=5")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(3);
    });

    it("should return 200 OK and have 5 results when limit is 5", async () => {
        const response = await supertest(app)
            .get("/repository?limit=5")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(3);
    });

    it("should return 200 OK and have 2 results when filtering for txt", async () => {
        const response = await supertest(app)
            .get("/repository?filter=txt")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 OK and have 1 results when filtering for txt and limit = 1", async () => {
        const response = await supertest(app)
            .get("/repository?filter=txt&limit=1")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 OK and have 0 results with a page that doesn'st exists", async () => {
        const response = await supertest(app)
            .get("/repository?limit=10&page=3000")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .get("/repository")
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .get("/repository")
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .get("/repository")
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});
