import supertest from "supertest";
import app from "../..";
import { generateToken } from "../../config/JwtConfig";
import Database from "../../database";

const baseRoute = "/sprint";

describe(`GET ${baseRoute}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 200 when no limit and page is provided and return by default 10 evaluation methods", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when page is 2 and return just 10 evaluation methods (the rest)", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?page=2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when limit is 5 and return 5 evaluation methods", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=5`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(4);
    });

    it("should return 200 when filtering start_date greater than '2023-01-01' and return 10 results and 2 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?start_date=2023-01-01`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when filtering end_date lower than '2021-03-15' and return 5 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?end_date=2021-03-15`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering start_date greater than '2023-01-01' and end_date lower than '2023-02-15' and return 3 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?start_date=2023-01-01&end_date=2023-02-15`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(3);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering evaluationMethodId equal '13' and return 5 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?evaluationMethodId=13`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?start_date=2023-01-01&end_date=2023-02-15&evaluationMethodId=13`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(3);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters with limit and page", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?start_date=2023-01-01&end_date=2023-02-15&evaluationMethodId=13&limit=1&page=1`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(3);
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

    it("should return 200 when search param start_date is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?start_date=2100-01-01`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param end_date is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?end_date=2000-01-01`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param evaluationMethodId is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?evaluationMethodId=9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
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

    it("should return 422 when start_date is not a valid date", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?start_date=invalid-date`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.start_date"]?.message).toContain(
            "start_date must be a Date"
        );
    });

    it("should return 422 when end_date is not a valid date", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?end_date=invalid-date`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.end_date"]?.message).toContain(
            "end_date must be a Date"
        );
    });

    it("should return 422 when evaluationMethodId is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?evaluationMethodId=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be an integer"
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

    it("should return 200 when sprint is found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.id).toBe("1");
        expect(response.body.name).toBe("Sprint 1");
        expect(response.body.start_date).toBe("2021-01-01T00:00:00.000Z");
        expect(response.body.end_date).toBe("2021-01-15T00:00:00.000Z");
        expect(response.body.evaluationMethodId).toBe("1");
    });

    it("should return 404 when sprint is not found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe("Sprint not found");
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

    it("should return 201 when creating a new sprint", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                name: "New sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.id).toBe(21);
        expect(response.body.name).toBe("New sprint");
        expect(response.body.start_date).toBe("2023-01-01T00:00:00.000Z");
        expect(response.body.end_date).toBe("2023-01-15T00:00:00.000Z");
        expect(response.body.evaluationMethodId).toBe(13);
    });

    it("should return 422 when name is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.name"]?.message).toBe(
            "name must be a string"
        );
    });

    it("should return 422 when name is empty (less than 1 character)", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.name"]?.message).toBe(
            "name must have a minimum length of 1"
        );
    });

    it("should return 422 when name is longer than 255 characters", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "a".repeat(256),
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.name"]?.message).toBe(
            "name must have a maximum length of 255"
        );
    });

    it("should return 422 when start_date is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "New sprint",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.start_date"]?.message).toBe(
            "start_date must be a Date"
        );
    });

    it("should return 422 when start_date is not a valid date", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "New sprint",
                start_date: "invalid-date",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.start_date"]?.message).toContain(
            "start_date must be a Date"
        );
    });

    it("should return 422 when end_date is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "New sprint",
                start_date: "2023-01-01",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.end_date"]?.message).toBe(
            "end_date must be a Date"
        );
    });

    it("should return 422 when end_date is not a valid date", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "New sprint",
                start_date: "2023-01-01",
                end_date: "invalid-date",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.end_date"]?.message).toContain(
            "end_date must be a Date"
        );
    });

    it("should return 422 when evaluationMethodId is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "New sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
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
                name: "New sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: "abc",
            });

        expect(response.body.error?.["body.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be an integer"
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

    it("should return 404 when evaluationMethodId is not found", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                name: "New sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 9999,
            });

        expect(response.body.message).toBe(
            "evaluationMethodId: 9999 not found"
        );
    });

    it("should return 400 when start_date is after end_date", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(400)
            .send({
                name: "New sprint",
                start_date: "2023-01-15",
                end_date: "2023-01-01",
                evaluationMethodId: 13,
            });

        expect(response.body.message).toBe(
            "start_date must be before end_date"
        );
    });

    it("should return 400 when start_date is equal to end_date", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(400)
            .send({
                name: "New sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-01",
                evaluationMethodId: 13,
            });

        expect(response.body.message).toBe(
            "start_date must be before end_date"
        );
    });
});

describe(`PUT ${baseRoute}/{id}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 200 when updating name, start_date, end_date and evaluationMethodId", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                name: "Updated sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.id).toBe("1");
        expect(response.body.name).toBe("Updated sprint");
        expect(response.body.start_date).toBe("2023-01-01T00:00:00.000Z");
        expect(response.body.end_date).toBe("2023-01-15T00:00:00.000Z");
        expect(response.body.evaluationMethodId).toBe("13");
    });

    it("should return 404 when sprint is not found", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                name: "Updated sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.message).toBe("Sprint with id: 9999 not found");
    });

    it("should return 422 when send another field (id) on body", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                id: 1,
                name: "Updated sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.id"]?.message).toBe(
            '"id" is an excess property and therefore is not allowed'
        );
    });

    it("should return 422 when some field (name) is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.name"]?.message).toBe(
            "name must be a string"
        );
    });

    it("should return 422 when name is not a string", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: 123,
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.name"]?.message).toBe(
            "name must be a string"
        );
    });

    it("should return 422 when name is empty (less than 1 character)", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.name"]?.message).toBe(
            "name must have a minimum length of 1"
        );
    });

    it("should return 422 when name is longer than 255 characters", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "a".repeat(256),
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.name"]?.message).toBe(
            "name must have a maximum length of 255"
        );
    });

    it("should return 422 when start_date is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "Updated sprint",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.start_date"]?.message).toBe(
            "start_date must be a Date"
        );
    });

    it("should return 422 when start_date is not a valid date", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "Updated sprint",
                start_date: "invalid-date",
                end_date: "2023-01-15",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.start_date"]?.message).toContain(
            "start_date must be a Date"
        );
    });

    it("should return 422 when end_date is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "Updated sprint",
                start_date: "2023-01-01",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.end_date"]?.message).toBe(
            "end_date must be a Date"
        );
    });

    it("should return 422 when end_date is not a valid date", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "Updated sprint",
                start_date: "2023-01-01",
                end_date: "invalid-date",
                evaluationMethodId: 13,
            });

        expect(response.body.error?.["body.end_date"]?.message).toContain(
            "end_date must be a Date"
        );
    });

    it("should return 422 when evaluationMethodId is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "Updated sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
            });

        expect(response.body.error?.["body.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be an integer"
        );
    });

    it("should return 422 when evaluationMethodId is not an integer", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                name: "Updated sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: "abc",
            });

        expect(response.body.error?.["body.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be an integer"
        );
    });

    it("should return 404 when evaluationMethodId is not found", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                name: "Updated sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-15",
                evaluationMethodId: 9999,
            });

        expect(response.body.message).toBe(
            "evaluationMethodId: 9999 not found"
        );
    });

    it("should return 400 when start_date is after end_date", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(400)
            .send({
                name: "Updated sprint",
                start_date: "2023-01-15",
                end_date: "2023-01-01",
                evaluationMethodId: 13,
            });

        expect(response.body.message).toBe(
            "start_date must be before end_date"
        );
    });

    it("should return 400 when start_date is equal to end_date", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(400)
            .send({
                name: "Updated sprint",
                start_date: "2023-01-01",
                end_date: "2023-01-01",
                evaluationMethodId: 13,
            });

        expect(response.body.message).toBe(
            "start_date must be before end_date"
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
});
