import supertest from "supertest";
import app from "../..";
import { generateToken } from "../../config/JwtConfig";
import Database from "../../database";

const baseRoute = "/evaluation-method";

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
        expect(response.body.totalPages).toBe(3);
    });

    it("should return 200 when page is 3 and return just 4 evaluation methods (the rest)", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?page=3`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(4);
        expect(response.body.totalPages).toBe(3);
    });

    it("should return 200 when limit is 5 and return 5 evaluation methods", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=5`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(5);
    });

    it("should return 200 when filtering description like 'Work 1' and return 4 results", async () => {
        const descriptionStringFilter = "Work 1";
        const asciiString = descriptionStringFilter.replace(/ /g, "%20");

        const response = await supertest(app)
            .get(`${baseRoute}?description=${asciiString}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(4);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering semester equal '1' and return 10 results and 2 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?semester=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when filtering year equal '2023' and return 10 results and 2 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?year=2023`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when force return disabled evaluation methods and return 36 results and 4 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?forceDisabled=true`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(4);
    });

    it("should return 200 when force return disabled evaluation methods and filter by disabledAt and return 10 results and 1 page", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?forceDisabled=true&disabledAt=2023-09-10`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when apply all filters", async () => {
        const descriptionStringFilter = "Work 1";
        const asciiString = descriptionStringFilter.replace(/ /g, "%20");

        const response = await supertest(app)
            .get(
                `${baseRoute}?description=${asciiString}&semester=1&year=2021&forceDisabled=true&disabledAt=2023-09-10`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 and all results when force return disabled evaluation methods and limit is 1000", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?forceDisabled=true&limit=1000`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(36);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 and return 0 results with a page that doesn'st exists", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=10&page=3000`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(3);
    });

    it("should return 200 when search param description is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?description=unexistent`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param semester is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?semester=3`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param year is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?year=2020`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param disabledAt is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?disabledAt=1900-01-01`)
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

    it("should return 422 when semester is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?semester=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.semester"]?.message).toBe(
            "semester must be an integer"
        );
    });

    it("should return 422 when year is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?year=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.year"]?.message).toContain(
            "year must be an integer"
        );
    });

    it("should return 422 when disabledAt is not a valid date", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?disabledAt=invalid-date`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.disabledAt"]?.message).toContain(
            "disabledAt must be a Date"
        );
    });

    it("should return 422 when forceDisabled is not a boolean", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?forceDisabled=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.forceDisabled"]?.message).toBe(
            "invalid boolean value"
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

    it("should return 200 when disabled evaluation method is found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.id).toBe("1");
        expect(response.body.description).toBe("Interdisciplinary Work 1");
        expect(response.body.semester).toBe(1);
        expect(response.body.year).toBe(2021);
        expect(response.body.disabledAt).toBe("2023-09-10T00:00:00.000Z");
    });

    it("should return 200 when non disabled evaluation method is found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/13`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.id).toBe("13");
        expect(response.body.description).toBe("Interdisciplinary Work 1");
        expect(response.body.semester).toBe(1);
        expect(response.body.year).toBe(2022);
        expect(response.body.disabledAt).toBe(null);
    });

    it("should return 404 when evaluation method is not found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe("Evaluation method not found");
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

    it("should return 201 when creating a new evaluation method", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                description: "New evaluation method",
                semester: 1,
                year: 2023,
                disabledAt: null,
            });

        expect(response.body.id).toBe(37);
        expect(response.body.description).toBe("New evaluation method");
        expect(response.body.semester).toBe(1);
        expect(response.body.year).toBe(2023);
        expect(response.body.disabledAt).toBe(null);
    });

    it("should return 201 when creating without disabledAt", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                description: "New evaluation method",
                semester: 1,
                year: 2023,
            });

        expect(response.body.id).toBe(38);
        expect(response.body.description).toBe("New evaluation method");
        expect(response.body.semester).toBe(1);
        expect(response.body.year).toBe(2023);
        expect(response.body.disabledAt).toBe(null);
    });

    it("should return 422 when description is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                semester: 1,
                year: 2023,
                disabledAt: null,
            });

        expect(response.body.error?.["body.description"]?.message).toBe(
            "description must be a string"
        );
    });

    it("should return 422 when description is not a string", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: 123,
                semester: 1,
                year: 2023,
                disabledAt: null,
            });

        expect(response.body.error?.["body.description"]?.message).toBe(
            "description must be a string"
        );
    });

    it("should return 422 when description is empty (less than 1 character)", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "",
                semester: 1,
                year: 2023,
                disabledAt: null,
            });

        expect(response.body.error?.["body.description"]?.message).toBe(
            "description must have a minimum length of 1"
        );
    });

    it("should return 422 when description is longer than 255 characters", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "a".repeat(256),
                semester: 1,
                year: 2023,
                disabledAt: null,
            });

        expect(response.body.error?.["body.description"]?.message).toBe(
            "description must have a maximum length of 255"
        );
    });

    it("should return 422 when semester is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "New evaluation method",
                year: 2023,
                disabledAt: null,
            });

        expect(response.body.error?.["body.semester"]?.message).toBe(
            "semester must be an integer"
        );
    });

    it("should return 422 when semester is not an integer", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "New evaluation method",
                semester: "abc",
                year: 2023,
                disabledAt: null,
            });

        expect(response.body.error?.["body.semester"]?.message).toBe(
            "semester must be an integer"
        );
    });

    it("should return 422 when year is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "New evaluation method",
                semester: 2023,
                disabledAt: null,
            });

        expect(response.body.error?.["body.year"]?.message).toBe(
            "year must be an integer"
        );
    });

    it("should return 422 when year is not an integer", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "New evaluation method",
                semester: 1,
                year: "abc",
                disabledAt: null,
            });

        expect(response.body.error?.["body.year"]?.message).toBe(
            "year must be an integer"
        );
    });

    it("should return 422 when disabledAt is not a valid date", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "New evaluation method",
                semester: 1,
                year: 2023,
                disabledAt: "invalid-date",
            });

        expect(response.body.error?.["body.disabledAt"]?.message).toContain(
            "disabledAt must be a Date"
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

    it("should return 200 when updating description, semester, year and disabledAt", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                description: "Updated evaluation method",
                semester: 2,
                year: 2024,
                disabledAt: null,
            });

        expect(response.body.id).toBe("1");
        expect(response.body.description).toBe("Updated evaluation method");
        expect(response.body.semester).toBe(2);
        expect(response.body.year).toBe(2024);
        expect(response.body.disabledAt).toBe(null);
    });

    it("should return 404 when evaluation method is not found", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                description: "Updated evaluation method",
                semester: 2,
                year: 2024,
                disabledAt: null,
            });

        expect(response.body.message).toBe(
            "Evaluation method with id: 9999 not found"
        );
    });

    it("should return 422 when send another field (id) on body", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                id: 2,
                description: "Updated evaluation method",
                semester: 2,
                year: 2024,
                disabledAt: null,
            });

        expect(response.body.error?.["body.id"]?.message).toBe(
            '"id" is an excess property and therefore is not allowed'
        );
    });

    it("should return 422 when some field is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                semester: 2,
                year: 2024,
                disabledAt: null,
            });

        expect(response.body.error?.["body.description"]?.message).toBe(
            "description must be a string"
        );
    });

    it("should return 422 when description is not a string", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: 123,
                semester: 2,
                year: 2024,
                disabledAt: null,
            });

        expect(response.body.error?.["body.description"]?.message).toBe(
            "description must be a string"
        );
    });

    it("should return 422 when description is empty (less than 1 character)", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "",
                semester: 2,
                year: 2024,
                disabledAt: null,
            });

        expect(response.body.error?.["body.description"]?.message).toBe(
            "description must have a minimum length of 1"
        );
    });

    it("should return 422 when description is longer than 255 characters", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "a".repeat(256),
                semester: 2,
                year: 2024,
                disabledAt: null,
            });

        expect(response.body.error?.["body.description"]?.message).toBe(
            "description must have a maximum length of 255"
        );
    });

    it("should return 422 when semester is not an integer", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "Updated evaluation method",
                semester: "abc",
                year: 2024,
                disabledAt: null,
            });

        expect(response.body.error?.["body.semester"]?.message).toBe(
            "semester must be an integer"
        );
    });

    it("should return 422 when year is not an integer", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "Updated evaluation method",
                semester: 2,
                year: "abc",
                disabledAt: null,
            });

        expect(response.body.error?.["body.year"]?.message).toBe(
            "year must be an integer"
        );
    });

    it("should return 422 when disabledAt is not a valid date", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                description: "Updated evaluation method",
                semester: 2,
                year: 2024,
                disabledAt: "invalid-date",
            });

        expect(response.body.error?.["body.disabledAt"]?.message).toContain(
            "disabledAt must be a Date"
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

describe(`DELETE ${baseRoute}/{id}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 204 when deleting a evaluation method", async () => {
        const response = await supertest(app)
            .delete(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(204)
            .send();

        expect(response.body).toStrictEqual({});
    });

    it("should return 204 when deleting a evaluation method that is already disabled", async () => {
        const response = await supertest(app)
            .delete(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(204)
            .send();

        expect(response.body).toStrictEqual({});
    });

    it("should return 404 when evaluation method is not found", async () => {
        const response = await supertest(app)
            .delete(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe(
            "Evaluation method with id: 9999 not found"
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
