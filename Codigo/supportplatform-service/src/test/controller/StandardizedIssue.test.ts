import supertest from "supertest";
import app from "../..";
import { generateToken } from "../../config/JwtConfig";
import Database from "../../database";

const baseRoute = "/standardized-issue";

describe(`GET ${baseRoute}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 200 when no limit and page is provided and return by default 10 standardized issues", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(2);
    });
    it("should return 200 when page is 2 and return 2 standardized issues", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?page=2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(4);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when limit is 2 and return 2 standardized issues", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(7);
    });

    it("should return 200 when filtering evaluationMethodId equal '14' and return 8 results and 1 page", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?evaluationMethodId=14`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering title contains 'Issue 12' and return 1 result and 1 page", async () => {
        const encodedQuery = encodeURIComponent("Issue 12");
        const response = await supertest(app)
            .get(`${baseRoute}?title=${encodedQuery}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering description contains 'Issue 12 description' and return 1 result and 1 page", async () => {
        const encodedQuery = encodeURIComponent("Issue 12 description");
        const response = await supertest(app)
            .get(`${baseRoute}?description=${encodedQuery}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters and return 1 result and 1 page", async () => {
        const encodedQueryTitle = encodeURIComponent("Issue 12");
        const encodedQueryDescription = encodeURIComponent(
            "Issue 12 description"
        );
        const response = await supertest(app)
            .get(
                `${baseRoute}?evaluationMethodId=14&title=${encodedQueryTitle}&description=${encodedQueryDescription}`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters with limit and page", async () => {
        const encodedQueryTitle = encodeURIComponent("Issue 12");
        const encodedQueryDescription = encodeURIComponent(
            "Issue 12 description"
        );
        const response = await supertest(app)
            .get(
                `${baseRoute}?evaluationMethodId=14&title=${encodedQueryTitle}&description=${encodedQueryDescription}&limit=1&page=1`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters with limit and page and return 0 results", async () => {
        const encodedQueryTitle = encodeURIComponent("Issue 12");
        const encodedQueryDescription = encodeURIComponent(
            "Issue 12 description"
        );
        const response = await supertest(app)
            .get(
                `${baseRoute}?evaluationMethodId=14&title=${encodedQueryTitle}&description=${encodedQueryDescription}&limit=1&page=2`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 and return 0 results with a page that doesn'st exists", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=10&page=3000`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when search param title is not found and return 0 results", async () => {
        const encodedQueryTitle = encodeURIComponent("Not exists");
        const response = await supertest(app)
            .get(`${baseRoute}?title=${encodedQueryTitle}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 404 when search param evaluationMethodId is not found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?evaluationMethodId=9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe(
            'Evaluation method not found by fields {"id":9999}'
        );
    });

    it("should return 200 when search param description is not found and return 0 results", async () => {
        const encodedQueryDescription = encodeURIComponent("Not exists");
        const response = await supertest(app)
            .get(`${baseRoute}?description=${encodedQueryDescription}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 422 when search param evaluationMethodId is lower than 1", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?evaluationMethodId=0`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be greater than or equal to 1"
        );
    });

    it("should return 422 when search param evaluationMethodId is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?evaluationMethodId=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be an integer"
        );
    });

    it("should return 422 when search param title is empty", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?title=`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.title"]?.message).toBe(
            "title must have a minimum length of 1"
        );
    });

    it("should return 422 when search param title is greater than 255", async () => {
        const encodedQuery = encodeURIComponent("a".repeat(256));
        const response = await supertest(app)
            .get(`${baseRoute}?title=${encodedQuery}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.title"]?.message).toBe(
            "title must have a maximum length of 255"
        );
    });

    it("should return 422 when search param description is empty", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?description=`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.description"]?.message).toBe(
            "description must have a minimum length of 1"
        );
    });

    it("should return 422 when search param page is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?page=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.page"]?.message).toBe(
            "page must be an integer"
        );
    });

    it("should return 422 when search param page is lesser than 1", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?page=0`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.page"]?.message).toBe(
            "page must be greater than or equal to 1"
        );
    });

    it("should return 422 when search param limit is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.limit"]?.message).toBe(
            "limit must be an integer"
        );
    });

    it("should return 422 when search param limit is lesser than 1", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=0`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.limit"]?.message).toBe(
            "limit must be greater than or equal to 1"
        );
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}`)
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}`)
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});

describe(`GET ${baseRoute}/{id}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 200 when standardized issue is found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.id).toBe("1");
        expect(response.body.evaluationMethodId).toBe("13");
        expect(response.body.title).toBe("Issue 1");
        expect(response.body.description).toBe("Issue 1 description");
    });

    it("should return 404 when standardized issue is not found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe(
            'Standardized issue not found by fields {"id":9999}'
        );
    });

    it("should return 422 when id is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["id"]?.message).toBe(
            "invalid float number"
        );
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/1`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/1`)
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/1`)
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});

describe(`POST ${baseRoute}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 201 when creating a new standardized issue", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                evaluationMethodId: 13,
                title: "Issue 13",
                description: "Issue 13 description",
            });

        expect(response.body.id).toBe(15);
        expect(response.body.evaluationMethodId).toBe(13);
        expect(response.body.title).toBe("Issue 13");
        expect(response.body.description).toBe("Issue 13 description");
    });

    it("should return 201 when description is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                evaluationMethodId: 13,
                title: "Issue 14",
            });

        expect(response.body.id).toBe(16);
        expect(response.body.evaluationMethodId).toBe(13);
        expect(response.body.title).toBe("Issue 14");
        expect(response.body.description).toBe(null);
    });

    it("should return 404 when evaluationMethodId is not found", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                evaluationMethodId: 9999,
                title: "Issue 15",
                description: "Issue 15 description",
            });

        expect(response.body.message).toBe(
            'Evaluation method not found by fields {"id":9999}'
        );
    });

    it("should return 422 when evaluationMethodId is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                title: "Issue 16",
                description: "Issue 16 description",
            });

        expect(response.body.error?.["body.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be an integer"
        );
    });

    it("should return 422 when evaluationMethodId is not an integer", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: "abc",
                title: "Issue 17",
                description: "Issue 17 description",
            });

        expect(response.body.error?.["body.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be an integer"
        );
    });

    it("should return 422 when evaluationMethodId is lower than 1", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 0,
                title: "Issue 18",
                description: "Issue 18 description",
            });

        expect(response.body.error?.["body.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be greater than or equal to 1"
        );
    });

    it("should return 422 when title is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 13,
                description: "Issue 19 description",
            });

        expect(response.body.error?.["body.title"]?.message).toBe(
            "title must be a string"
        );
    });

    it("should return 422 when title is empty", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 13,
                title: "",
                description: "Issue 20 description",
            });

        expect(response.body.error?.["body.title"]?.message).toBe(
            "title must have a minimum length of 1"
        );
    });

    it("should return 422 when title is greater than 255", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 13,
                title: "a".repeat(256),
                description: "Issue 21 description",
            });

        expect(response.body.error?.["body.title"]?.message).toBe(
            "title must have a maximum length of 255"
        );
    });

    it("should return 422 when description is not a string", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 13,
                title: "Issue 22",
                description: 123,
            });

        expect(response.body.error?.["body.description"]?.message).toContain(
            "description must be a string"
        );
    });

    it("should return 422 when send another field (id) on body", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                id: 1,
                evaluationMethodId: 13,
                title: "Issue 24",
                description: "Issue 24 description",
            });

        expect(response.body.error?.["body.id"]?.message).toBe(
            '"id" is an excess property and therefore is not allowed'
        );
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});

describe(`PUT ${baseRoute}/{id}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 200 when updating evaluationMethodId, title and description", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                evaluationMethodId: 14,
                title: "Updated Issue 1",
                description: "Updated Issue 1 description",
            });

        expect(response.body.id).toBe("1");
        expect(response.body.evaluationMethodId).toBe("14");
        expect(response.body.title).toBe("Updated Issue 1");
        expect(response.body.description).toBe("Updated Issue 1 description");
    });

    it("should return 200 when updating evaluationMethodId, title and description", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                evaluationMethodId: 14,
                title: "Updated Issue 1",
                description: "Updated Issue 1 description",
            });

        expect(response.body.id).toBe("1");
        expect(response.body.evaluationMethodId).toBe("14");
        expect(response.body.title).toBe("Updated Issue 1");
        expect(response.body.description).toBe("Updated Issue 1 description");
    });

    it("should return 200 when description is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                evaluationMethodId: 14,
                title: "Updated Issue 1",
            });

        expect(response.body.id).toBe("1");
        expect(response.body.evaluationMethodId).toBe("14");
        expect(response.body.title).toBe("Updated Issue 1");
        expect(response.body.description).toBe("Updated Issue 1 description");
    });

    it("should return 200 when update description to null", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                evaluationMethodId: 14,
                title: "Updated Issue 1",
                description: null,
            });

        expect(response.body.id).toBe("1");
        expect(response.body.evaluationMethodId).toBe("14");
        expect(response.body.title).toBe("Updated Issue 1");
        expect(response.body.description).toBe(null);
    });

    it("should return 404 when evaluation method is not found", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                evaluationMethodId: 9999,
                title: "Updated Issue 1",
                description: "Updated Issue 1 description",
            });

        expect(response.body.message).toBe(
            'Evaluation method not found by fields {"id":9999}'
        );
    });

    it("should return 422 when updating only title", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                title: "Updated Issue 1",
            });

        expect(response.body.error?.["body.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be an integer"
        );
    });

    it("should return 422 when updating only evaluationMethodId", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
            });

        expect(response.body.error?.["body.title"]?.message).toBe(
            "title must be a string"
        );
    });

    it("should return 422 when send another field (id) on body", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                id: 1,
                evaluationMethodId: 14,
                title: "Updated Issue 1",
                description: "Updated Issue 1 description",
            });

        expect(response.body.error?.["body.id"]?.message).toBe(
            '"id" is an excess property and therefore is not allowed'
        );
    });

    it("should return 404 when standardized issue is not found", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                evaluationMethodId: 14,
                title: "Updated Issue 1",
                description: "Updated Issue 1 description",
            });

        expect(response.body.message).toBe(
            'Standardized issue not found by fields {"id":9999}'
        );
    });

    it("should return 422 when evaluationMethodId is not a number", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: "abc",
                title: "Updated Issue 1",
                description: "Updated Issue 1 description",
            });

        expect(response.body.error?.["body.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be an integer"
        );
    });

    it("should return 422 when evaluationMethodId is lower than 1", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 0,
                title: "Updated Issue 1",
                description: "Updated Issue 1 description",
            });

        expect(response.body.error?.["body.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be greater than or equal to 1"
        );
    });

    it("should return 422 when title is not a string", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                title: 123,
                description: "Updated Issue 1 description",
            });

        expect(response.body.error?.["body.title"]?.message).toContain(
            "title must be a string"
        );
    });

    it("should return 422 when title is empty", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                title: "",
                description: "Updated Issue 1 description",
            });

        expect(response.body.error?.["body.title"]?.message).toContain(
            "title must have a minimum length of 1"
        );
    });

    it("should return 422 when title is greater than 255", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                title: "a".repeat(256),
                description: "Updated Issue 1 description",
            });

        expect(response.body.error?.["body.title"]?.message).toContain(
            "title must have a maximum length of 255"
        );
    });

    it("should return 422 when description is not a string", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                title: "Updated Issue 1",
                description: 123,
            });

        expect(response.body.error?.["body.description"]?.message).toContain(
            "description must be a string"
        );
    });

    it("should return 422 when description is empty", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                title: "Updated Issue 1",
                description: "",
            });

        expect(response.body.error?.["body.description"]?.message).toContain(
            "description must have a minimum length of 1"
        );
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });

    it("should return 401 when user is not authenticated", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });
});

describe(`DELETE ${baseRoute}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 204 when deleting standardized issue without associations with consistency rules", async () => {
        const response = await supertest(app)
            .delete(`${baseRoute}/13`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(204)
            .send();

        expect(response.body).toStrictEqual({});
    });

    it("should return 400 when deleting a standardized issue with associations with consistency rules", async () => {
        const response = await supertest(app)
            .delete(`${baseRoute}/14`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(400)
            .send();

        expect(response.body.message).toBe(
            "StandardizedIssue cannot be deleted because it has associated evaluations"
        );
    });

    it("should return 404 when standardized issue is not found", async () => {
        const response = await supertest(app)
            .delete(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe(
            'Standardized issue not found by fields {"id":9999}'
        );
    });

    it("should return 422 when id is not a number", async () => {
        const response = await supertest(app)
            .delete(`${baseRoute}/abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["id"]?.message).toBe(
            "invalid float number"
        );
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .delete(`${baseRoute}/1`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .delete(`${baseRoute}/1`)
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .delete(`${baseRoute}/1`)
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});
