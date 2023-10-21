import supertest from "supertest";
import app from "../..";
import { generateToken } from "../../config/JwtConfig";
import Database from "../../database";

const baseRoute = "/consistency-rule-delivery";

describe(`GET ${baseRoute}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 200 when no limit and page is provided and return by default 10 consistency rules deliveries", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when page is 2 and return 0 consistency rules deliveries", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?page=2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when limit is 2 and return 2 consistency rules deliveries", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(5);
    });

    it("should return 200 when filtering consistencyRuleId equal '1' and return 6 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?consistencyRuleId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering repositoryId equal '1' and return 5 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when deliveryAt equal '2023-10-01' and return 3 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?deliveryAt=2023-10-01`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(3);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering deliveryAtStart greater than '2023-10-01' and return 6 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?deliveryAtStart=2023-10-01`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(6);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering deliveryAtEnd lower than '2023-10-05' and return 3 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?deliveryAtEnd=2023-10-05`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(3);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering deliveryAtStart greater than '2023-10-01' and deliveryAtEnd lower than '2023-10-05' and return 3 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?deliveryAtStart=2023-10-01&deliveryAtEnd=2023-10-05`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(3);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering status equal 'AWAITING_DELIVERY' and return 2 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?status=AWAITING_DELIVERY`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?consistencyRuleId=1&repositoryId=1&deliveryAt=2023-10-01&deliveryAtStart=2023-10-01&deliveryAtEnd=2023-10-05&status=DELIVERED_ON_TIME`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters with limit and page", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?consistencyRuleId=1&repositoryId=1&deliveryAt=2023-10-01&deliveryAtStart=2023-10-01&deliveryAtEnd=2023-10-05&status=DELIVERED_ON_TIME`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 and return 0 results with a page that doesn'st exists", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=10&page=3000`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param consistencyRuleId is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?consistencyRuleId=9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param repositoryId is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?repositoryId=9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param deliveryAt has a date that doesn't exists data and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?deliveryAt=2100-10-10`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param deliveryAtStart has a date that doesn't exists data and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?deliveryAtStart=2100-10-10`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param deliveryAtEnd has a date that doesn't exists data and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?deliveryAtEnd=1900-10-10`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 422 when search param consistencyRuleId is lower than 1", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?consistencyRuleId=0`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.consistencyRuleId"]?.message).toBe(
            "consistencyRuleId must be greater than or equal to 1"
        );
    });

    it("should return 422 when search param consistencyRuleId is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?consistencyRuleId=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.consistencyRuleId"]?.message).toBe(
            "consistencyRuleId must be an integer"
        );
    });

    it("should return 422 when search param repositoryId is lower than 1", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?repositoryId=0`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.repositoryId"]?.message).toBe(
            "repositoryId must be greater than or equal to 1"
        );
    });

    it("should return 422 when search param repositoryId is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?repositoryId=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.repositoryId"]?.message).toBe(
            "repositoryId must be an integer"
        );
    });

    it("should return 422 when search param deliveryAt is not a date", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?deliveryAt=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.deliveryAt"]?.message).toBe(
            "deliveryAt must be a Date"
        );
    });

    it("should return 422 when search param deliveryAtStart is not a date", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?deliveryAtStart=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.deliveryAtStart"]?.message).toBe(
            "deliveryAtStart must be a Date"
        );
    });

    it("should return 422 when search param deliveryAtEnd is not a date", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?deliveryAtEnd=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.deliveryAtEnd"]?.message).toBe(
            "deliveryAtEnd must be a Date"
        );
    });

    it("should return 422 when search param status is not valid", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?status=INVALID`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.status"]?.message).toBe(
            "should be one of the following; ['AWAITING_DELIVERY','DELIVERED_ON_TIME','DELIVERED_LATE','NOT_DELIVERED','DELIVERED_WITH_INVALIDITY']"
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

    it("should return 200 when consistency rule delivery is found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.id).toBe("2");
        expect(response.body.consistencyRuleId).toBe("1");
        expect(response.body.repositoryId).toBe("1");
        expect(response.body.deliveryAt).toBe("2023-10-01T00:00:00.000Z");
        expect(response.body.status).toBe("DELIVERED_ON_TIME");
    });

    it("should return 404 when consistency rule delivery is not found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe(
            'Consistency rule delivery not found by fields {"id":9999}'
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

    it("should return 201 when creating a new consistency rule delivery with AWAITING_DELIVERY status", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: null,
                status: "AWAITING_DELIVERY",
            });

        expect(response.body.id).toBe(11);
        expect(response.body.consistencyRuleId).toBe(1);
        expect(response.body.repositoryId).toBe(1);
        expect(response.body.deliveryAt).toBe(null);
        expect(response.body.status).toBe("AWAITING_DELIVERY");
    });

    it("should return 201 when creating a new consistency rule delivery with DELIVERED_ON_TIME status", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.id).toBe(12);
        expect(response.body.consistencyRuleId).toBe(1);
        expect(response.body.repositoryId).toBe(1);
        expect(response.body.deliveryAt).toBe("2023-10-01T00:00:00.000Z");
        expect(response.body.status).toBe("DELIVERED_ON_TIME");
    });

    it("should return 201 when creating a new consistency rule delivery with DELIVERED_LATE status", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_LATE",
            });

        expect(response.body.id).toBe(13);
        expect(response.body.consistencyRuleId).toBe(1);
        expect(response.body.repositoryId).toBe(1);
        expect(response.body.deliveryAt).toBe("2023-10-01T00:00:00.000Z");
        expect(response.body.status).toBe("DELIVERED_LATE");
    });

    it("should return 201 when creating a new consistency rule delivery with NOT_DELIVERED status", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: null,
                status: "NOT_DELIVERED",
            });

        expect(response.body.id).toBe(14);
        expect(response.body.consistencyRuleId).toBe(1);
        expect(response.body.repositoryId).toBe(1);
        expect(response.body.deliveryAt).toBe(null);
        expect(response.body.status).toBe("NOT_DELIVERED");
    });

    it("should return 201 when creating a new consistency rule delivery with DELIVERED_WITH_INVALIDITY status", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_WITH_INVALIDITY",
            });

        expect(response.body.id).toBe(15);
        expect(response.body.consistencyRuleId).toBe(1);
        expect(response.body.repositoryId).toBe(1);
        expect(response.body.deliveryAt).toBe("2023-10-01T00:00:00.000Z");
        expect(response.body.status).toBe("DELIVERED_WITH_INVALIDITY");
    });

    it("should return 201 when creating a new consistency rule delivery with deliveryAt 2023-10-01 and status DELIVERED_ON_TIME", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.id).toBe(16);
        expect(response.body.consistencyRuleId).toBe(1);
        expect(response.body.repositoryId).toBe(1);
        expect(response.body.deliveryAt).toBe("2023-10-01T00:00:00.000Z");
        expect(response.body.status).toBe("DELIVERED_ON_TIME");
    });

    it("should return 201 when creating a new consistency rule delivery with deliveryAt 2023-10-01 and status DELIVERED_LATE", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_LATE",
            });

        expect(response.body.id).toBe(17);
        expect(response.body.consistencyRuleId).toBe(1);
        expect(response.body.repositoryId).toBe(1);
        expect(response.body.deliveryAt).toBe("2023-10-01T00:00:00.000Z");
        expect(response.body.status).toBe("DELIVERED_LATE");
    });

    it("should return 201 when creating a new consistency rule delivery with deliveryAt 2023-10-01 and status DELIVERED_WITH_INVALIDITY", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_WITH_INVALIDITY",
            });

        expect(response.body.id).toBe(18);
        expect(response.body.consistencyRuleId).toBe(1);
        expect(response.body.repositoryId).toBe(1);
        expect(response.body.deliveryAt).toBe("2023-10-01T00:00:00.000Z");
        expect(response.body.status).toBe("DELIVERED_WITH_INVALIDITY");
    });

    it("should return 400 when creating a new consistency rule delivery with deliveryAt 2023-10-01 and status AWAITING_DELIVERY", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "AWAITING_DELIVERY",
            })
            .expect(400);

        expect(response.body.message).toBe(
            "Cannot set deliveryAt when status is AWAITING_DELIVERY"
        );
    });

    it("should return 400 when creating a new consistency rule delivery with deliveryAt 2023-10-01 and status NOT_DELIVERED", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "NOT_DELIVERED",
            })
            .expect(400);

        expect(response.body.message).toBe(
            "Cannot set deliveryAt when status is NOT_DELIVERED"
        );
    });

    it("should return 404 when consistencyRuleId is not found", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 9999,
                repositoryId: 1,
                deliveryAt: null,
                status: "AWAITING_DELIVERY",
            })
            .expect(404);

        expect(response.body.message).toBe(
            'Consistency rule not found by fields {"id":9999}'
        );
    });

    it("should return 404 when repositoryId is not found", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 1,
                repositoryId: 9999,
                deliveryAt: null,
                status: "AWAITING_DELIVERY",
            })
            .expect(404);

        expect(response.body.message).toBe(
            'Repository not found by fields {"id":9999}'
        );
    });

    it("should return 422 when consistencyRuleId is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                repositoryId: 1,
                deliveryAt: null,
                status: "AWAITING_DELIVERY",
            })
            .expect(422);

        expect(response.body.error?.["body.consistencyRuleId"]?.message).toBe(
            "consistencyRuleId must be an integer"
        );
    });

    it("should return 422 when repositoryId is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 1,
                deliveryAt: null,
                status: "AWAITING_DELIVERY",
            })
            .expect(422);

        expect(response.body.error?.["body.repositoryId"]?.message).toBe(
            "repositoryId must be an integer"
        );
    });

    it("should return 422 when status is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: null,
            })
            .expect(422);

        expect(response.body.error?.["body.status"]?.message).toBe(
            "'status' is required"
        );
    });

    it("should return 422 when consistencyRuleId is not an integer", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: "abc",
                repositoryId: 1,
                deliveryAt: null,
                status: "AWAITING_DELIVERY",
            })
            .expect(422);

        expect(response.body.error?.["body.consistencyRuleId"]?.message).toBe(
            "consistencyRuleId must be an integer"
        );
    });

    it("should return 422 when repositoryId is not an integer", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 1,
                repositoryId: "abc",
                deliveryAt: null,
                status: "AWAITING_DELIVERY",
            })
            .expect(422);

        expect(response.body.error?.["body.repositoryId"]?.message).toBe(
            "repositoryId must be an integer"
        );
    });

    it("should return 422 when deliveryAt is not a date", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: "abc",
                status: "AWAITING_DELIVERY",
            })
            .expect(422);

        expect(response.body.error?.["body.deliveryAt"]?.message).toContain(
            "deliveryAt must be a Date"
        );
    });

    it("should return 422 when status is not valid", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: null,
                status: "INVALID",
            })
            .expect(422);

        expect(response.body.error?.["body.status"]?.message).toBe(
            "should be one of the following; ['AWAITING_DELIVERY','DELIVERED_ON_TIME','DELIVERED_LATE','NOT_DELIVERED','DELIVERED_WITH_INVALIDITY']"
        );
    });

    it("should return 422 when consistencyRuleId is lower than 1", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 0,
                repositoryId: 1,
                deliveryAt: null,
                status: "AWAITING_DELIVERY",
            })
            .expect(422);

        expect(response.body.error?.["body.consistencyRuleId"]?.message).toBe(
            "consistencyRuleId must be greater than or equal to 1"
        );
    });

    it("should return 422 when repositoryId is lower than 1", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 1,
                repositoryId: 0,
                deliveryAt: null,
                status: "AWAITING_DELIVERY",
            })
            .expect(422);

        expect(response.body.error?.["body.repositoryId"]?.message).toBe(
            "repositoryId must be greater than or equal to 1"
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

    it("should return 200 when updating all fields", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.id).toBe("2");
        expect(response.body.consistencyRuleId).toBe("1");
        expect(response.body.repositoryId).toBe("1");
        expect(response.body.deliveryAt).toBe("2023-10-01T00:00:00.000Z");
        expect(response.body.status).toBe("DELIVERED_ON_TIME");
    });

    it("should return 200 when deliveryAt is not provided and status is DELIVERED_ON_TIME", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.id).toBe("2");
        expect(response.body.consistencyRuleId).toBe("1");
        expect(response.body.repositoryId).toBe("1");
        expect(response.body.deliveryAt).toBe("2023-10-01T00:00:00.000Z");
        expect(response.body.status).toBe("DELIVERED_ON_TIME");
    });

    it("should return 200 when deliveryAt is not provided and status is DELIVERED_LATE", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                status: "DELIVERED_LATE",
            });

        expect(response.body.id).toBe("2");
        expect(response.body.consistencyRuleId).toBe("1");
        expect(response.body.repositoryId).toBe("1");
        expect(response.body.deliveryAt).toBe("2023-10-01T00:00:00.000Z");
        expect(response.body.status).toBe("DELIVERED_LATE");
    });

    it("should return 200 when deliveryAt is not provided and status is DELIVERED_WITH_INVALIDITY", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                status: "DELIVERED_WITH_INVALIDITY",
            });

        expect(response.body.id).toBe("2");
        expect(response.body.consistencyRuleId).toBe("1");
        expect(response.body.repositoryId).toBe("1");
        expect(response.body.deliveryAt).toBe("2023-10-01T00:00:00.000Z");
        expect(response.body.status).toBe("DELIVERED_WITH_INVALIDITY");
    });

    it("should return 400 when deliveryAt is provided and status is AWAITING_DELIVERY", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "AWAITING_DELIVERY",
            })
            .expect(400);

        expect(response.body.message).toBe(
            "Cannot set deliveryAt when status is AWAITING_DELIVERY"
        );
    });

    it("should return 400 when deliveryAt is provided and status is NOT_DELIVERED", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "NOT_DELIVERED",
            })
            .expect(400);

        expect(response.body.message).toBe(
            "Cannot set deliveryAt when status is NOT_DELIVERED"
        );
    });

    it("should return 404 when consistency rule delivery is not found", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.message).toBe(
            'Consistency rule delivery not found by fields {"id":9999}'
        );
    });

    it("should return 422 when send another field (id) on body", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                id: 2,
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.error?.["body.id"]?.message).toBe(
            '"id" is an excess property and therefore is not allowed'
        );
    });

    it("should return 422 when consistencyRuleId is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.error?.["body.consistencyRuleId"]?.message).toBe(
            "consistencyRuleId must be an integer"
        );
    });

    it("should return 422 when repositoryId is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                consistencyRuleId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.error?.["body.repositoryId"]?.message).toBe(
            "repositoryId must be an integer"
        );
    });

    it("should return 422 when status is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
            });

        expect(response.body.error?.["body.status"]?.message).toBe(
            "'status' is required"
        );
    });

    it("should return 422 when consistencyRuleId is not an integer", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                consistencyRuleId: "abc",
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.error?.["body.consistencyRuleId"]?.message).toBe(
            "consistencyRuleId must be an integer"
        );
    });

    it("should return 422 when repositoryId is not an integer", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                consistencyRuleId: 1,
                repositoryId: "abc",
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.error?.["body.repositoryId"]?.message).toBe(
            "repositoryId must be an integer"
        );
    });

    it("should return 422 when deliveryAt is not a date", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: "abc",
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.error?.["body.deliveryAt"]?.message).toContain(
            "deliveryAt must be a Date"
        );
    });

    it("should return 422 when status is not valid", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                consistencyRuleId: 1,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "INVALID",
            });

        expect(response.body.error?.["body.status"]?.message).toBe(
            "should be one of the following; ['AWAITING_DELIVERY','DELIVERED_ON_TIME','DELIVERED_LATE','NOT_DELIVERED','DELIVERED_WITH_INVALIDITY']"
        );
    });

    it("should return 422 when consistencyRuleId is lower than 1", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                consistencyRuleId: 0,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.error?.["body.consistencyRuleId"]?.message).toBe(
            "consistencyRuleId must be greater than or equal to 1"
        );
    });

    it("should return 422 when repositoryId is lower than 1", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                consistencyRuleId: 1,
                repositoryId: 0,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.error?.["body.repositoryId"]?.message).toBe(
            "repositoryId must be greater than or equal to 1"
        );
    });

    it("should return 404 when consistencyRuleId is not found", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                consistencyRuleId: 9999,
                repositoryId: 1,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.message).toBe(
            'Consistency rule not found by fields {"id":9999}'
        );
    });

    it("should return 404 when repositoryId is not found", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                consistencyRuleId: 1,
                repositoryId: 9999,
                deliveryAt: new Date("2023-10-01"),
                status: "DELIVERED_ON_TIME",
            });

        expect(response.body.message).toBe(
            'Repository not found by fields {"id":9999}'
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
