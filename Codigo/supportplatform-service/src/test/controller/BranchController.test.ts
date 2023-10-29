import supertest from "supertest";
import { repositoryTestingSeed } from "../seed/repository";
import app from "../..";
import Database from "../../database";
import { generateToken } from "../../config/JwtConfig";

const testRepositoryId = repositoryTestingSeed[2].id;

beforeAll(async () => {
    await new Database().connect();
});

describe("GET repository/{repositoryId}/branch", () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 422 when search param page is not a number", async () => {
        const response = await supertest(app)
            .get(`/repository/${testRepositoryId}/branch?page=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.page"]?.message).toBe(
            "page must be an integer"
        );
    });

    it("should return 422 when search param page is lesser than 1", async () => {
        const response = await supertest(app)
            .get(`/repository/${testRepositoryId}/branch?page=0`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.page"]?.message).toBe(
            "page must be greater than or equal to 1"
        );
    });

    it("should return 422 when search param limit is not a number", async () => {
        const response = await supertest(app)
            .get(`/repository/${testRepositoryId}/branch?limit=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.limit"]?.message).toBe(
            "limit must be an integer"
        );
    });

    it("should return 422 when search param limit is lesser than 1", async () => {
        const response = await supertest(app)
            .get(`/repository/${testRepositoryId}/branch?limit=0`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.limit"]?.message).toBe(
            "limit must be greater than or equal to 1"
        );
    });

    it("should return 200 when missing params, and default to limit=10 and page=1", async () => {
        const response = await supertest(app)
            .get(`/repository/${testRepositoryId}/branch`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when page is 2, and return just 2 repos (the rest)", async () => {
        const response = await supertest(app)
            .get(`/repository/${testRepositoryId}/branch?page=2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 and return 5 repos, when limit is 5", async () => {
        const response = await supertest(app)
            .get(`/repository/${testRepositoryId}/branch?limit=5`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(3);
    });

    it("should return 200 OK and have 5 results when limit is 5", async () => {
        const response = await supertest(app)
            .get(`/repository/${testRepositoryId}/branch?limit=5`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(3);
    });

    it("should return 200 OK and have 0 results with a page that doesn'st exists", async () => {
        const response = await supertest(app)
            .get(`/repository/${testRepositoryId}/branch?limit=10&page=3000`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 404 when repositoryId is not found", async () => {
        const response = await supertest(app)
            .get(`/repository/12354/branch`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe("Repository not found");
    });
    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .get("/repository/1/branch")
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .get("/repository/1/branch")
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .get("/repository/1/branch")
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});

describe("PATCH /repository/{id}/branch/{branchId}", () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 200 when update the branch with commit automatic synchronization true", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                commitAutomaticSynchronization: true,
            });

        // Keep same fields
        expect(response.body.id).toBe("2");
        expect(response.body.name).toBe("dev");
        expect(response.body.repositoryId).toBe("1");

        // Updatable fields
        expect(response.body.fileAutomaticSynchronization).toBe(false);

        // Updated fields
        expect(response.body.commitAutomaticSynchronization).toBe(true);
    });

    it("should return 200 when update the branch with commit automatic synchronization false", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                commitAutomaticSynchronization: false,
            });

        // Keep same fields
        expect(response.body.id).toBe("2");
        expect(response.body.name).toBe("dev");
        expect(response.body.repositoryId).toBe("1");

        // Updatable fields
        expect(response.body.fileAutomaticSynchronization).toBe(false);

        // Updated fields
        expect(response.body.commitAutomaticSynchronization).toBe(false);
    });

    it("should return 200 when update the branch with file automatic synchronization true", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                fileAutomaticSynchronization: true,
            });

        // Keep same fields
        expect(response.body.id).toBe("2");
        expect(response.body.name).toBe("dev");
        expect(response.body.repositoryId).toBe("1");

        // Updatable fields
        expect(response.body.commitAutomaticSynchronization).toBe(false);

        // Updated fields
        expect(response.body.fileAutomaticSynchronization).toBe(true);
    });

    it("should return 200 when update the branch with file automatic synchronization false", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                fileAutomaticSynchronization: false,
            });

        // Keep same fields
        expect(response.body.id).toBe("2");
        expect(response.body.name).toBe("dev");
        expect(response.body.repositoryId).toBe("1");

        // Updatable fields
        expect(response.body.fileAutomaticSynchronization).toBe(false);

        // Updated fields
        expect(response.body.commitAutomaticSynchronization).toBe(false);
    });

    it("should return 200 when update the branch with commit and file automatic synchronization true", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                fileAutomaticSynchronization: true,
                commitAutomaticSynchronization: true,
            });

        // Keep same fields
        expect(response.body.id).toBe("2");
        expect(response.body.name).toBe("dev");
        expect(response.body.repositoryId).toBe("1");

        // Updatable fields
        // Updated fields
        expect(response.body.fileAutomaticSynchronization).toBe(true);
        expect(response.body.commitAutomaticSynchronization).toBe(true);
    });

    it("should return 200 when update the branch with commit and file automatic synchronization false", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                fileAutomaticSynchronization: false,
                commitAutomaticSynchronization: false,
            });

        // Keep same fields
        expect(response.body.id).toBe("2");
        expect(response.body.name).toBe("dev");
        expect(response.body.repositoryId).toBe("1");

        // Updatable fields
        // Updated fields
        expect(response.body.commitAutomaticSynchronization).toBe(false);
        expect(response.body.fileAutomaticSynchronization).toBe(false);
    });

    it("should return 200 when update passing nothing and nothing should change", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({});

        // Keep same fields
        expect(response.body.id).toBe("2");
        expect(response.body.name).toBe("dev");
        expect(response.body.repositoryId).toBe("1");

        // Updatable fields
        expect(response.body.fileAutomaticSynchronization).toBe(false);
        expect(response.body.commitAutomaticSynchronization).toBe(false);
    });

    it("should return 422 when tries to update name", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "new-name",
            });

        expect(response.body.error?.["body.name"]?.message).toBe(
            '"name" is an excess property and therefore is not allowed'
        );
    });

    it("should return 422 when tries to update repositoryId", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                repositoryId: 2,
            });

        expect(response.body.error?.["body.repositoryId"]?.message).toBe(
            '"repositoryId" is an excess property and therefore is not allowed'
        );
    });

    it("should return 404 when repository does not exists", async () => {
        const response = await supertest(app)
            .patch("/repository/8888888/branch/2")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                fileAutomaticSynchronization: false,
                commitAutomaticSynchronization: false,
            });

        expect(response.body.message).toContain("Repository not found");
    });

    it("should return 404 when branch does not exists", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/222222")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                fileAutomaticSynchronization: false,
                commitAutomaticSynchronization: false,
            });

        expect(response.body.message).toContain("Branch not found");
    });

    it("should return 404 when branch does not belong to repository id", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/4")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({});

        expect(response.body.message).toBe("Branch not found");
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .patch("/repository/1/branch/2")
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});
