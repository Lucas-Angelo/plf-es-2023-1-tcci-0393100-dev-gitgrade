import supertest from "supertest";
import { generateToken } from "../../config/JwtConfig";
import Database from "../../database";
import app from "../..";

const baseRoute = "/commit";

describe(`GET ${baseRoute}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 200 when no limit and page is provided and return by default 10 commits", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(3);
    });
    it("should return 200 when page is 3 and return 4 commits", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?page=3`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(4);
        expect(response.body.totalPages).toBe(3);
    });

    it("should return 200 when limit is 2 and return 2 commits", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(12);
    });

    it("should return 200 when filtering startedAt '2023-02-10T02:30-03:00' and return 9 results and 1 page", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?startedAt=2023-02-10T02:30-03:00`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(9);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering endedAt lower than '2023-02-02T14:00:00-03:00' and return 4 results and 1 page", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?endedAt=2023-02-02T14:00:00-03:00`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(4);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering startedAt greater than '2023-02-03T20:00:00-03:00' and endedAt lower than '2023-02-04T23:59:00-03:00' and return 3 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?startedAt=2023-02-03T20:00:00-03:00&endedAt=2023-02-04T23:59:00-03:00`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(4);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering repositoryId equal '1' and return 10 results and 2 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(10);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when filtering branchName equal 'dev' and return 4 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?branchName=dev`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(4);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering repositoryId equal '1' and branchName equal 'main' and return 7 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?branchName=main&repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(7);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering message equal 'bad' and return 2 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?message=bad`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering contributor equal 'august' and return 5 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?contributor=august`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering contributor equal 'august' and filterWithNoContributor equal 'true' and return 9 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?contributor=august&filterWithNoContributor=true`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(9);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering filterWithNoContributor equal 'true' and return 4 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?filterWithNoContributor=true`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(4);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?startedAt=2023-01-01&endedAt=2023-02-15&repositoryId=1&contributor=august&branchName=main&filterWithNoContributor=true`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(4);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters with limit and page", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?startedAt=2023-01-01&endedAt=2023-02-15&repositoryId=1&contributor=august&branchName=main&filterWithNoContributor=true&limit=3&page=2`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(2);
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

    it("should return 200 when search param startedAt is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?startedAt=2100-01-01`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param endedAt is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?endedAt=2000-01-01`)
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

    it("should return 422 when startedAt is not a valid date", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?startedAt=invalid-date`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.startedAt"]?.message).toBe(
            "startedAt must be a Date"
        );
    });

    it("should return 422 when endedAt is not a valid date", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?endedAt=invalid-date`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.endedAt"]?.message).toBe(
            "endedAt must be a Date"
        );
    });

    it("should return 422 when repositoryId is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?repositoryId=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.repositoryId"]?.message).toBe(
            "repositoryId must be an integer"
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
