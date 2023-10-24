import supertest from "supertest";
import { generateToken } from "../../config/JwtConfig";
import Database from "../../database";
import app from "../..";
import { FileResponseDTO } from "@gitgrade/dtos";
import { branchTestingSeed } from "../seed/branch";

const baseRoute = "/file";

describe(`GET ${baseRoute}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 200 when no limit and page is provided and return by default 8 files", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(8);
        expect(response.body.totalPages).toBe(1);

        const resultsPathAdditionsDeletions = response.body.results.map(
            (result: FileResponseDTO) => {
                return {
                    path: result.path,
                    additions: result.additions,
                    deletions: result.deletions,
                };
            }
        );

        expect(resultsPathAdditionsDeletions).toContainEqual({
            path: "src/file1.ts",
            additions: "22",
            deletions: "15",
        });
        expect(resultsPathAdditionsDeletions).toContainEqual({
            path: "src/file2.ts",
            additions: "100",
            deletions: "25",
        });
        expect(resultsPathAdditionsDeletions).toContainEqual({
            path: "src/file3.ts",
            additions: "25",
            deletions: "0",
        });
        expect(resultsPathAdditionsDeletions).toContainEqual({
            path: "src/index.html",
            additions: "25",
            deletions: "0",
        });
        expect(resultsPathAdditionsDeletions).toContainEqual({
            path: "src/style.css",
            additions: "25",
            deletions: "0",
        });
        expect(resultsPathAdditionsDeletions).toContainEqual({
            path: "src/pagina2.html",
            additions: "30",
            deletions: "0",
        });
        expect(resultsPathAdditionsDeletions).toContainEqual({
            path: "src/file4.ts",
            additions: "25",
            deletions: "50",
        });
        expect(resultsPathAdditionsDeletions).toContainEqual({
            path: "src/pagina3.html",
            additions: "25",
            deletions: "0",
        });
    });
    it("should return 200 when page is 2 and limit is 5 and return 3 files", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?page=2&repositoryId=1&limit=5`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(3);
        expect(response.body.totalPages).toBe(2);
    });

    it("should return 200 when limit is 2 and return 2 files", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=2&repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(4);
    });

    it("should return 200 when filtering startedAt '2023-03-01T02:30-03:00' and return 3 results and 1 page", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?startedAt=2023-03-01T02:30-03:00&repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(3);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering endedAt lower than '2023-01-10T02:01:00-03:00' and return 2 results and 1 page", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?endedAt=2023-01-10T02:01:00-03:00&repositoryId=1`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering startedAt greater than '2023-02-03T20:00:00-03:00' and endedAt lower than '2023-02-04T00:00:00-03:00' and return 1 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?startedAt=2023-02-03T20:00:00-03:00&endedAt=2023-02-04T00:00:00-03:00&repositoryId=1`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering repositoryId equal '16' and return 1 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?repositoryId=${branchTestingSeed[16].repositoryId}`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering branchName equal 'dev' and return 1 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?branchName=dev&repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering path equal '.ts' and return 4 results and 1 pages", async () => {
        const pathFilter = encodeURIComponent(".ts");
        const response = await supertest(app)
            .get(`${baseRoute}?path=${pathFilter}&repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(4);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering contributor equal 'august' and return 5 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?contributor=august&repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering contributor equal 'august' and filterWithNoContributor equal 'true' and return 7 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(
                `${baseRoute}?contributor=august&filterWithNoContributor=true&repositoryId=1`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(7);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering filterWithNoContributor equal 'true' and return 3 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?filterWithNoContributor=true&repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(3);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters", async () => {
        const pathFilter = encodeURIComponent(".ts");
        const response = await supertest(app)
            .get(
                `${baseRoute}?startedAt=2023-01-01&endedAt=2023-02-15&repositoryId=1&contributor=august&branchName=main&filterWithNoContributor=true&path=${pathFilter}`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(3);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters with limit and page", async () => {
        const pathFilter = encodeURIComponent(".ts");
        const response = await supertest(app)
            .get(
                `${baseRoute}?startedAt=2023-01-01&endedAt=2023-02-15&repositoryId=1&contributor=august&branchName=main&filterWithNoContributor=true&path=${pathFilter}&page=2&limit=1`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(3);
    });

    it("should return 200 and return 0 results with a page that doesn'st exists", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=10&page=3000&repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param startedAt is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?startedAt=2100-01-01&repositoryId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param endedAt is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?endedAt=2000-01-01&repositoryId=1`)
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

    it("should return 422 when repositoryId is not provided", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.repositoryId"]?.message).toBe(
            "repositoryId must be an integer"
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
