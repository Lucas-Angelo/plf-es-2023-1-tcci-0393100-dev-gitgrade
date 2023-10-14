import supertest from "supertest";
import app from "../..";
import { generateToken } from "../../config/JwtConfig";
import Database from "../../database";

const baseRoute = "/consistency-rule";

describe(`GET ${baseRoute}`, () => {
    const authUser = generateToken(1);

    beforeAll(async () => {
        await new Database().connect();
    });

    it("should return 200 when no limit and page is provided and return by default 10 consistency rules", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(6);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when page is 2 and return 0 consistency rules", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?page=2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when limit is 2 and return 2 consistency rules", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?limit=2`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(3);
    });

    it("should return 200 when filtering evaluationMethodId equal '14' and return 2 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?evaluationMethodId=14`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering sprintId equal '11' and return 2 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?sprintId=11`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(2);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering standardizedIssueId equal '1' and return 0 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?standardizedIssueId=1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering description contains 'DocumentoDaArquitetura.docx' and return 5 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?description=DocumentoDaArquitetura.docx`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering filePath contains 'Documentacao/' and return 5 results and 1 pages", async () => {
        const encodedQuery = encodeURIComponent("Documentacao/");
        const response = await supertest(app)
            .get(`${baseRoute}?filePath=${encodedQuery}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when filtering validationType equal 'DEFAULT' and return 5 results and 1 pages", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?validationType=DEFAULT`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(5);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters (without standardizedIssueId)", async () => {
        const encodedQueryDescription = encodeURIComponent(
            "Consistency Rule 6 for DocumentoDaArquitetura.docx"
        );
        const encodedQueryFilePath = encodeURIComponent("Documentacao/");
        const response = await supertest(app)
            .get(
                `${baseRoute}?evaluationMethodId=14&sprintId=11&description=${encodedQueryDescription}&filePath=${encodedQueryFilePath}&validationType=DEFAULT`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(1);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when apply all filters with limit and page", async () => {
        const encodedQueryDescription = encodeURIComponent(
            "DocumentoDaArquitetura.docx"
        );
        const encodedQueryFilePath = encodeURIComponent("Documentacao/");
        const response = await supertest(app)
            .get(
                `${baseRoute}?evaluationMethodId=14&sprintId=11&description=${encodedQueryDescription}&filePath=${encodedQueryFilePath}&validationType=DEFAULT&limit=1&page=1`
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

    it("should return 200 when search param sprintId is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?sprintId=9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
    });

    it("should return 200 when search param standardizedIssueId is not found and return 0 results", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?standardizedIssueId=9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.results).toHaveLength(0);
        expect(response.body.totalPages).toBe(1);
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

    it("should return 200 when search param filePath is not found and return 0 results", async () => {
        const encodedQueryFilePath = encodeURIComponent("Not exists");
        const response = await supertest(app)
            .get(`${baseRoute}?filePath=${encodedQueryFilePath}`)
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

    it("should return 422 when search param sprintId is lower than 1", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?sprintId=0`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.sprintId"]?.message).toBe(
            "sprintId must be greater than or equal to 1"
        );
    });

    it("should return 422 when search param sprintId is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?sprintId=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.sprintId"]?.message).toBe(
            "sprintId must be an integer"
        );
    });

    it("should return 422 when search param standardizedIssueId is lower than 1", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?standardizedIssueId=0`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(
            response.body.error?.["query.standardizedIssueId"]?.message
        ).toBe("standardizedIssueId must be greater than or equal to 1");
    });

    it("should return 422 when search param standardizedIssueId is not a number", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?standardizedIssueId=abc`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(
            response.body.error?.["query.standardizedIssueId"]?.message
        ).toBe("standardizedIssueId must be an integer");
    });

    it("should return 422 when search param validationType is not valid", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}?validationType=INVALID`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.validationType"]?.message).toBe(
            "should be one of the following; ['DEFAULT','CFF']"
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

    it("should return 200 when consistency rule is found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        expect(response.body.id).toBe("1");
        expect(response.body.evaluationMethodId).toBe("13");
        expect(response.body.sprintId).toBe("6");
        expect(response.body.standardizedIssueId).toBe(null);
        expect(response.body.description).toBe(
            "Consistency Rule 1 for DocumentoDeRequisitos.docx"
        );
        expect(response.body.filePath).toBe(
            "Documentacao/DocumentoDeRequisitos.docx"
        );
        expect(response.body.validationType).toBe("DEFAULT");
    });

    it("should return 404 when consistency rule is not found", async () => {
        const response = await supertest(app)
            .get(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe(
            'Consistency rule not found by fields {"id":9999}'
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

    it("should return 201 when creating a new consistency rule with DEFAULT validationType", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            });

        expect(response.body.id).toBe(7);
        expect(response.body.evaluationMethodId).toBe(14);
        expect(response.body.sprintId).toBe(11);
        expect(response.body.standardizedIssueId).toBe(null);
        expect(response.body.description).toBe(
            "Consistency Rule 7 for DocumentoDaArquitetura.docx"
        );
        expect(response.body.filePath).toBe(
            "Documentacao/DocumentoDoProjeto.md"
        );
        expect(response.body.validationType).toBe("DEFAULT");
    });

    it("should return 201 when creating a new consistency rule with CFF validationType", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(201)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 8 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "CFF",
            });

        expect(response.body.id).toBe(8);
        expect(response.body.evaluationMethodId).toBe(14);
        expect(response.body.sprintId).toBe(11);
        expect(response.body.standardizedIssueId).toBe(null);
        expect(response.body.description).toBe(
            "Consistency Rule 8 for DocumentoDaArquitetura.docx"
        );
        expect(response.body.filePath).toBe(
            "Documentacao/DocumentoDoProjeto.md"
        );
        expect(response.body.validationType).toBe("CFF");
    });

    it("should return 201 when standardizedIssueId is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                description:
                    "Consistency Rule 9 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            })
            .expect(201);

        expect(response.body.id).toBe(9);
        expect(response.body.evaluationMethodId).toBe(14);
        expect(response.body.sprintId).toBe(11);
        expect(response.body.standardizedIssueId).toBe(null);
        expect(response.body.description).toBe(
            "Consistency Rule 9 for DocumentoDaArquitetura.docx"
        );
        expect(response.body.filePath).toBe(
            "Documentacao/DocumentoDoProjeto.md"
        );
        expect(response.body.validationType).toBe("DEFAULT");
    });

    it("should return 201 when description is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            })
            .expect(201);

        expect(response.body.id).toBe(10);
        expect(response.body.evaluationMethodId).toBe(14);
        expect(response.body.sprintId).toBe(11);
        expect(response.body.standardizedIssueId).toBe(null);
        expect(response.body.filePath).toBe(
            "Documentacao/DocumentoDoProjeto.md"
        );
        expect(response.body.validationType).toBe("DEFAULT");
    });

    it("should return 404 when evaluationMethodId is not found", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 9999,
                sprintId: 11,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 10 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            })
            .expect(404);

        expect(response.body.message).toBe(
            'Evaluation method not found by fields {"id":9999}'
        );
    });

    it("should return 404 when sprintId is not found", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 9999,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 11 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            })
            .expect(404);

        expect(response.body.message).toBe(
            'Sprint not found by fields {"id":9999}'
        );
    });

    it("should return 404 when standardizedIssueId is not found", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: 9999,
                description:
                    "Consistency Rule 12 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            })
            .expect(404);

        expect(response.body.message).toBe(
            'Standardized issue not found by fields {"id":9999}'
        );
    });

    it("should return 404 when sprintId dosn't belongs to evaluationMethodId", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 9,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 13 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            })
            .expect(404);

        expect(response.body.message).toBe(
            "Sprint not found for the provided evaluation method"
        );
    });

    it("should return 422 when evaluationMethodId is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                sprintId: 11,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
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
                sprintId: 11,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
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
                sprintId: 11,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            });

        expect(response.body.error?.["body.evaluationMethodId"]?.message).toBe(
            "evaluationMethodId must be greater than or equal to 1"
        );
    });

    it("should return 422 when sprintId is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            });

        expect(response.body.error?.["body.sprintId"]?.message).toBe(
            "sprintId must be an integer"
        );
    });

    it("should return 422 when sprintId is not an integer", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: "abc",
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            });

        expect(response.body.error?.["body.sprintId"]?.message).toBe(
            "sprintId must be an integer"
        );
    });

    it("should return 422 when sprintId is lower than 1", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 0,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            });

        expect(response.body.error?.["body.sprintId"]?.message).toBe(
            "sprintId must be greater than or equal to 1"
        );
    });

    it("should return 422 when standardizedIssueId is not an integer", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: "abc",
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
            });

        expect(
            response.body.error?.["body.standardizedIssueId"]?.message
        ).toContain("standardizedIssueId must be an integer");
    });

    it("should return 422 when standardizedIssueId is lower than 1", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: 0,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
            });

        expect(
            response.body.error?.["body.standardizedIssueId"]?.message
        ).toContain("standardizedIssueId must be greater than or equal to 1");
    });

    it("should return 422 when description is empty (less than 1 character)", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            })
            .expect(422);

        expect(response.body.error?.["body.description"]?.message).toContain(
            "description must have a minimum length of 1"
        );
    });

    it("should return 422 when description is longer than 255 characters", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "a".repeat(256),
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "DEFAULT",
            })
            .expect(422);

        expect(response.body.error?.["body.description"]?.message).toContain(
            "description must have a maximum length of 255"
        );
    });

    it("should return 422 when filePath is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                validationType: "DEFAULT",
            })
            .expect(422);

        expect(response.body.error?.["body.filePath"]?.message).toBe(
            "filePath must be a string"
        );
    });

    it("should return 422 when filePath is empty (less than 1 character)", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "",
                validationType: "DEFAULT",
            })
            .expect(422);

        expect(response.body.error?.["body.filePath"]?.message).toBe(
            "filePath must have a minimum length of 1"
        );
    });

    it("should return 422 when filePath is longer than 10000 characters", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "a".repeat(10001),
                validationType: "DEFAULT",
            })
            .expect(422);

        expect(response.body.error?.["body.filePath"]?.message).toBe(
            "filePath must have a maximum length of 10000"
        );
    });

    it("should return 422 when validationType is not provided", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
            })
            .expect(422);

        expect(response.body.error?.["body.validationType"]?.message).toBe(
            "'validationType' is required"
        );
    });

    it("should return 422 when validationType is not valid", async () => {
        const response = await supertest(app)
            .post(`${baseRoute}`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description:
                    "Consistency Rule 7 for DocumentoDaArquitetura.docx",
                filePath: "Documentacao/DocumentoDoProjeto.md",
                validationType: "INVALID",
            })
            .expect(422);

        expect(response.body.error?.["body.validationType"]?.message).toBe(
            "should be one of the following; ['DEFAULT','CFF']"
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

    it("should return 200 when updating evaluationMethodId, sprintId, standardizedIssueId, description, filePath and validationType", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "Updated Consistency Rule 1",
                filePath: "Updated File Path",
                validationType: "CFF",
            });

        expect(response.body.id).toBe("1");
        expect(response.body.evaluationMethodId).toBe("14");
        expect(response.body.sprintId).toBe("11");
        expect(response.body.standardizedIssueId).toBe(null);
        expect(response.body.description).toBe("Updated Consistency Rule 1");
        expect(response.body.filePath).toBe("Updated File Path");
        expect(response.body.validationType).toBe("CFF");
    });

    it("should return 404 when consistency rule is not found", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/9999`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "Updated Consistency Rule 1",
                filePath: "Updated File Path",
                validationType: "CFF",
            });

        expect(response.body.message).toBe(
            'Consistency rule not found by fields {"id":9999}'
        );
    });

    it("should return 404 when sprintId dosn't belongs to evaluationMethodId", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send({
                evaluationMethodId: 14,
                sprintId: 9,
                standardizedIssueId: undefined,
                description: "Updated Consistency Rule 1",
                filePath: "Updated File Path",
                validationType: "CFF",
            });

        expect(response.body.message).toBe(
            "Sprint not found for the provided evaluation method"
        );
    });

    it("should return 200 when description is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                filePath: "Updated File Path",
                validationType: "CFF",
            });

        expect(response.body.id).toBe("1");
        expect(response.body.evaluationMethodId).toBe("14");
        expect(response.body.sprintId).toBe("11");
        expect(response.body.standardizedIssueId).toBe(null);
        expect(response.body.description).toBe("Updated Consistency Rule 1");
        expect(response.body.filePath).toBe("Updated File Path");
        expect(response.body.validationType).toBe("CFF");
    });

    it("should return 422 when send another field (id) on body", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                id: 1,
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "Updated Consistency Rule 1",
                filePath: "Updated File Path",
                validationType: "CFF",
            });

        expect(response.body.error?.["body.id"]?.message).toBe(
            '"id" is an excess property and therefore is not allowed'
        );
    });

    it("should return 422 when description is not a string", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: 123,
                filePath: "Updated File Path",
                validationType: "CFF",
            });

        expect(response.body.error?.["body.description"]?.message).toContain(
            "description must be a string"
        );
    });

    it("should return 422 when description is empty (less than 1 character)", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "",
                filePath: "Updated File Path",
                validationType: "CFF",
            });

        expect(response.body.error?.["body.description"]?.message).toContain(
            "description must have a minimum length of 1"
        );
    });

    it("should return 422 when description is longer than 255 characters", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "a".repeat(256),
                filePath: "Updated File Path",
                validationType: "CFF",
            });

        expect(response.body.error?.["body.description"]?.message).toContain(
            "description must have a maximum length of 255"
        );
    });

    it("should return 422 when filePath is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "Updated Consistency Rule 1",
                validationType: "CFF",
            });

        expect(response.body.error?.["body.filePath"]?.message).toBe(
            "filePath must be a string"
        );
    });

    it("should return 422 when filePath is not a string", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "Updated Consistency Rule 1",
                filePath: 123,
                validationType: "CFF",
            });

        expect(response.body.error?.["body.filePath"]?.message).toBe(
            "filePath must be a string"
        );
    });

    it("should return 422 when filePath is empty (less than 1 character)", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "Updated Consistency Rule 1",
                filePath: "",
                validationType: "CFF",
            });

        expect(response.body.error?.["body.filePath"]?.message).toBe(
            "filePath must have a minimum length of 1"
        );
    });

    it("should return 422 when filePath is longer than 10000 characters", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "Updated Consistency Rule 1",
                filePath: "a".repeat(10001),
                validationType: "CFF",
            });

        expect(response.body.error?.["body.filePath"]?.message).toBe(
            "filePath must have a maximum length of 10000"
        );
    });

    it("should return 422 when validationType is not provided", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "Updated Consistency Rule 1",
                filePath: "Updated File Path",
            });

        expect(response.body.error?.["body.validationType"]?.message).toBe(
            "'validationType' is required"
        );
    });

    it("should return 422 when validationType is not valid", async () => {
        const response = await supertest(app)
            .put(`${baseRoute}/1`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send({
                evaluationMethodId: 14,
                sprintId: 11,
                standardizedIssueId: undefined,
                description: "Updated Consistency Rule 1",
                filePath: "Updated File Path",
                validationType: "INVALID",
            });

        expect(response.body.error?.["body.validationType"]?.message).toBe(
            "should be one of the following; ['DEFAULT','CFF']"
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
