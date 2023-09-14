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

describe("PATCH /repository/{id}", () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 200 when update the repository with new evaluation method 13 and automatic synchronization true", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                evaluationMethodId: 13,
                automaticSynchronization: true,
            });

        // Keep same fields
        expect(response.body.id).toBe("1");
        expect(response.body.name).toBe("typescript-utilsTxT");
        expect(response.body.defaultBranch).toBe("main");
        expect(response.body.description).toBe(
            "Collection of utility functions for TypeScript"
        );
        expect(response.body.forkCount).toBe("25");
        expect(response.body.githubCreatedAt).toBe("2022-01-10T00:00:00.000Z");
        expect(response.body.githubId).toBe("repo1");
        expect(response.body.hasIssuesEnabled).toBe(true);
        expect(response.body.hasProjectsEnabled).toBe(true);
        expect(response.body.licenseName).toBe("MIT");
        expect(response.body.primaryLanguage).toBe("TypeScript");
        expect(response.body.stargazerCount).toBe("100");
        expect(response.body.synchronizing).toBe(false);

        // Updated fields
        expect(response.body.automaticSynchronization).toBe(true);
        expect(response.body.evaluationMethod.id).toBe("13");
        expect(response.body.evaluationMethod.description).toBe(
            "Interdisciplinary Work 1"
        );
        expect(response.body.evaluationMethod.semester).toBe(1);
        expect(response.body.evaluationMethod.year).toBe(2022);
        expect(response.body.evaluationMethod.disabledAt).toBe(null);
    });

    it("should return 200 when update the repository with new evaluation method disabled and automatic synchronization false", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                evaluationMethodId: null,
                automaticSynchronization: false,
            });

        // Keep same fields
        expect(response.body.id).toBe("1");
        expect(response.body.name).toBe("typescript-utilsTxT");
        expect(response.body.defaultBranch).toBe("main");
        expect(response.body.description).toBe(
            "Collection of utility functions for TypeScript"
        );
        expect(response.body.forkCount).toBe("25");
        expect(response.body.githubCreatedAt).toBe("2022-01-10T00:00:00.000Z");
        expect(response.body.githubId).toBe("repo1");
        expect(response.body.hasIssuesEnabled).toBe(true);
        expect(response.body.hasProjectsEnabled).toBe(true);
        expect(response.body.licenseName).toBe("MIT");
        expect(response.body.primaryLanguage).toBe("TypeScript");
        expect(response.body.stargazerCount).toBe("100");
        expect(response.body.synchronizing).toBe(false);

        // Updated fields
        expect(response.body.automaticSynchronization).toBe(false);
        expect(response.body.evaluationMethod).toBe(null);
    });

    it("should return 200 when update the repository with evaluation method disabled and automatic synchronization true", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                evaluationMethodId: 1, // Disabled
                automaticSynchronization: true,
            });

        // Keep same fields
        expect(response.body.id).toBe("1");
        expect(response.body.name).toBe("typescript-utilsTxT");
        expect(response.body.defaultBranch).toBe("main");
        expect(response.body.description).toBe(
            "Collection of utility functions for TypeScript"
        );
        expect(response.body.forkCount).toBe("25");
        expect(response.body.githubCreatedAt).toBe("2022-01-10T00:00:00.000Z");
        expect(response.body.githubId).toBe("repo1");
        expect(response.body.hasIssuesEnabled).toBe(true);
        expect(response.body.hasProjectsEnabled).toBe(true);
        expect(response.body.licenseName).toBe("MIT");
        expect(response.body.primaryLanguage).toBe("TypeScript");
        expect(response.body.stargazerCount).toBe("100");
        expect(response.body.synchronizing).toBe(false);

        // Updated fields
        expect(response.body.automaticSynchronization).toBe(true);
        expect(response.body.evaluationMethod).toBe(null); // Evaluation method with id 1 is disabled
    });

    it("should return 200 when update only evaluation method", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                evaluationMethodId: 13,
            });

        // Keep same fields
        expect(response.body.id).toBe("1");
        expect(response.body.name).toBe("typescript-utilsTxT");
        expect(response.body.defaultBranch).toBe("main");
        expect(response.body.description).toBe(
            "Collection of utility functions for TypeScript"
        );
        expect(response.body.forkCount).toBe("25");
        expect(response.body.githubCreatedAt).toBe("2022-01-10T00:00:00.000Z");
        expect(response.body.githubId).toBe("repo1");
        expect(response.body.hasIssuesEnabled).toBe(true);
        expect(response.body.hasProjectsEnabled).toBe(true);
        expect(response.body.licenseName).toBe("MIT");
        expect(response.body.primaryLanguage).toBe("TypeScript");
        expect(response.body.stargazerCount).toBe("100");
        expect(response.body.synchronizing).toBe(false);

        expect(response.body.evaluationMethod.disabledAt).toBe(null);

        // Updated fields
        expect(response.body.automaticSynchronization).toBe(true);
        expect(response.body.evaluationMethod.id).toBe("13");
        expect(response.body.evaluationMethod.description).toBe(
            "Interdisciplinary Work 1"
        );
        expect(response.body.evaluationMethod.semester).toBe(1);
        expect(response.body.evaluationMethod.year).toBe(2022);
    });

    it("should return 200 when update only automatic synchronization", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                automaticSynchronization: false,
            });

        // Keep same fields
        expect(response.body.id).toBe("1");
        expect(response.body.name).toBe("typescript-utilsTxT");
        expect(response.body.defaultBranch).toBe("main");
        expect(response.body.description).toBe(
            "Collection of utility functions for TypeScript"
        );
        expect(response.body.forkCount).toBe("25");
        expect(response.body.githubCreatedAt).toBe("2022-01-10T00:00:00.000Z");
        expect(response.body.githubId).toBe("repo1");
        expect(response.body.hasIssuesEnabled).toBe(true);
        expect(response.body.hasProjectsEnabled).toBe(true);
        expect(response.body.licenseName).toBe("MIT");
        expect(response.body.primaryLanguage).toBe("TypeScript");
        expect(response.body.stargazerCount).toBe("100");
        expect(response.body.synchronizing).toBe(false);

        expect(response.body.evaluationMethod.id).toBe("13");
        expect(response.body.evaluationMethod.description).toBe(
            "Interdisciplinary Work 1"
        );
        expect(response.body.evaluationMethod.semester).toBe(1);
        expect(response.body.evaluationMethod.year).toBe(2022);
        expect(response.body.evaluationMethod.disabledAt).toBe(null);

        // Updated fields
        expect(response.body.automaticSynchronization).toBe(false);
    });

    it("should return 422 when evaluation method id is not a number", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: "abc",
                automaticSynchronization: true,
            });

        expect(
            response.body.error?.["body.evaluationMethodId"]?.message
        ).toContain("evaluationMethodId must be an integer");
    });

    it("should return 422 when evaluation method id is lesser than 1", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 0,
                automaticSynchronization: true,
            });

        expect(
            response.body.error?.["body.evaluationMethodId"]?.message
        ).toContain("evaluationMethodId must be greater than or equal to 1");
    });

    it("should return 422 when automatic synchronization is not a boolean value", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 0,
                automaticSynchronization: "abc",
            });

        expect(
            response.body.error?.["body.automaticSynchronization"]?.message
        ).toContain("invalid boolean value");
    });

    it("should return 404 when repository id doesn't exists", async () => {
        const response = await supertest(app)
            .patch("/repository/9999")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                evaluationMethodId: 1,
                automaticSynchronization: true,
            });

        expect(response.body.message).toBe("Repository not found");
    });

    it("should return 404 when evaluation method id doesn't exists", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                evaluationMethodId: 9999,
                automaticSynchronization: true,
            });

        expect(response.body.message).toBe("Evaluation method not found");
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .patch("/repository/1")
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});
