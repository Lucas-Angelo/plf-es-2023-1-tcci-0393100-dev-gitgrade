import supertest from "supertest";
import app from "../..";
import { repositoryTestingSeed } from "../seed/repository";
import {
    CommitMetricsDTO,
    CommitQualityMetricsDTO,
    FileChangeMetricsDTO,
    FileTypeMetricsDTO,
    IssueMetricsDTO,
} from "@gitgrade/dtos";
import { contributorTestingSeed } from "../seed/contributor";
import Database from "../../database";
import { generateToken } from "../../config/JwtConfig";

beforeAll(async () => {
    await new Database().connect();
});

describe("GET /repository/:id/metric/commit", () => {
    const authUser = generateToken(1);

    it("should return 422 when search param startedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit?startedAt=abc`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.startedAt"]?.message).toBe(
            "startedAt must be a valid date"
        );
    });

    it("should return 422 when search param endedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit?endedAt=abc`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.endedAt"]?.message).toBe(
            "endedAt must be a valid date"
        );
    });

    it("should return 422 when search param startedAt is greater than endedAt", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit?startedAt=2021-01-01&endedAt=2020-01-01`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        console.log("its in the soil of boot", response.body);

        expect(response.body.error?.["query.startedAt"]?.message).toBe(
            "startedAt must be less than or equal to endedAt"
        );
        expect(response.body.error?.["query.endedAt"]?.message).toBe(
            "endedAt must be greater than or equal to startedAt"
        );
        expect(response.body.message).toBe("Invalid date interval");
    });

    it("should return 404 when repository does not exist", async () => {
        const response = await supertest(app)
            .get("/repository/999/metric/commit")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe("Repository not found");
    });

    it("should return 200 when missing params, and default to startedAt = project's createdAt, endedAt = now and branch = project's default", async () => {
        const response = await supertest(app)
            .get(`/repository/${repositoryTestingSeed[0].id}/metric/commit`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        const body: CommitMetricsDTO = response.body;
        const contributorsIds = body.commitsPerContributor.map(
            (item) => item.contribuitor.id
        );

        expect(body.totalCommitCount).toBe(5);
        expect(body.commitsPerContributor).toHaveLength(3);
        expect(contributorsIds).toContain(contributorTestingSeed[0].id);
        expect(contributorsIds).toContain(contributorTestingSeed[1].id);
        expect(contributorsIds).toContain(contributorTestingSeed[2].id);

        const contributor1 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[0].id
        );
        const contributor2 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[1].id
        );
        const contributor3 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[2].id
        );

        expect(contributor1?.commitCount).toBe(1);
        expect(contributor2?.commitCount).toBe(1);
        expect(contributor3?.commitCount).toBe(3);

        expect(contributor1?.commtiPercentage).toBe(20);
        expect(contributor2?.commtiPercentage).toBe(20);
        expect(contributor3?.commtiPercentage).toBe(60);
    });

    it("should return 200 with one less commit, when branch = dev", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit?branchName=dev`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        const body: CommitMetricsDTO = response.body;
        const contributorsIds = body.commitsPerContributor.map(
            (item) => item.contribuitor.id
        );

        expect(body.totalCommitCount).toBe(4);
        expect(body.commitsPerContributor).toHaveLength(3);
        expect(contributorsIds).toContain(contributorTestingSeed[0].id);
        expect(contributorsIds).toContain(contributorTestingSeed[1].id);
        expect(contributorsIds).toContain(contributorTestingSeed[2].id);

        const contributor1 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[0].id
        );
        const contributor2 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[1].id
        );
        const contributor3 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[2].id
        );

        expect(contributor1?.commitCount).toBe(1);
        expect(contributor2?.commitCount).toBe(1);
        expect(contributor3?.commitCount).toBe(2);

        expect(contributor1?.commtiPercentage).toBe(25);
        expect(contributor2?.commtiPercentage).toBe(25);
        expect(contributor3?.commtiPercentage).toBe(50);
    });

    it("should return 200 the three last commits, when startedAt = 2023-02-04", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit?startedAt=2023-02-04`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        const body: CommitMetricsDTO = response.body;
        const contributorsIds = body.commitsPerContributor.map(
            (item) => item.contribuitor.id
        );

        expect(body.totalCommitCount).toBe(3);
        expect(body.commitsPerContributor).toHaveLength(1);
        expect(contributorsIds).toContain(contributorTestingSeed[2].id);

        const contributor3 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[2].id
        );

        expect(contributor3?.commitCount).toBe(3);

        expect(contributor3?.commtiPercentage).toBe(100);
    });

    it("should return 200 and the two last commits, when startedAt = 2023-02-04 and branch = dev", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit?startedAt=2023-02-04&branchName=dev`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        const body: CommitMetricsDTO = response.body;
        const contributorsIds = body.commitsPerContributor.map(
            (item) => item.contribuitor.id
        );

        expect(body.totalCommitCount).toBe(2);
        expect(body.commitsPerContributor).toHaveLength(1);
        expect(contributorsIds).toContain(contributorTestingSeed[2].id);

        const contributor3 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[2].id
        );

        expect(contributor3?.commitCount).toBe(2);

        expect(contributor3?.commtiPercentage).toBe(100);
    });

    it("should return 200 and the two first commits, when endedAt = 2023-02-03", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit?endedAt=2023-02-03`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        const body: CommitMetricsDTO = response.body;
        const contributorsIds = body.commitsPerContributor.map(
            (item) => item.contribuitor.id
        );

        expect(body.totalCommitCount).toBe(2);
        expect(body.commitsPerContributor).toHaveLength(2);
        expect(contributorsIds).toContain(contributorTestingSeed[0].id);
        expect(contributorsIds).toContain(contributorTestingSeed[1].id);

        const contributor1 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[0].id
        );
        const contributor2 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[1].id
        );

        expect(contributor1?.commitCount).toBe(1);
        expect(contributor2?.commitCount).toBe(1);

        expect(contributor1?.commtiPercentage).toBe(50);
        expect(contributor2?.commtiPercentage).toBe(50);
    });

    it("should return 200 and the two middle commits, when startedAt = 2023-02-03  and endedAt = 2023-02-04", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit?endedAt=2023-02-04&startedAt=2023-02-03`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        const body: CommitMetricsDTO = response.body;
        const contributorsIds = body.commitsPerContributor.map(
            (item) => item.contribuitor.id
        );

        expect(body.totalCommitCount).toBe(2);
        expect(body.commitsPerContributor).toHaveLength(2);
        expect(contributorsIds).toContain(contributorTestingSeed[1].id);
        expect(contributorsIds).toContain(contributorTestingSeed[2].id);

        const contributor2 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[1].id
        );
        const contributor3 = body.commitsPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[2].id
        );

        expect(contributor2?.commitCount).toBe(1);
        expect(contributor3?.commitCount).toBe(1);

        expect(contributor2?.commtiPercentage).toBe(50);
        expect(contributor3?.commtiPercentage).toBe(50);
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/commit")
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/commit")
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/commit")
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});

describe("GET /repository/:id/metric/commit-quality", () => {
    const authUser = generateToken(1);

    it("should return 422 when search param startedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit-quality?startedAt=abc`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.startedAt"]?.message).toBe(
            "startedAt must be a valid date"
        );
    });

    it("should return 422 when search param endedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit-quality?endedAt=abc`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.endedAt"]?.message).toBe(
            "endedAt must be a valid date"
        );
    });

    it("should return 422 when search param startedAt is greater than endedAt", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit-quality?startedAt=2021-01-01&endedAt=2020-01-01`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.startedAt"]?.message).toBe(
            "startedAt must be less than or equal to endedAt"
        );
        expect(response.body.error?.["query.endedAt"]?.message).toBe(
            "endedAt must be greater than or equal to startedAt"
        );
        expect(response.body.message).toBe("Invalid date interval");
    });

    it("should return 404 when repository does not exist", async () => {
        const response = await supertest(app)
            .get("/repository/999/metric/commit-quality")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe("Repository not found");
    });

    it("should return 200 when missing params, and default to startedAt = project's createdAt, endedAt = now and branch = project's default", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[3].id}/metric/commit-quality`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        const body: CommitQualityMetricsDTO = response.body;
        const contributorsIds = body.commitQualityPerContributor.map(
            (item) => item.contributor.id
        );

        expect(body.generalCommitQualityLevel[0].qualityLevelCount).toBe(1);
        expect(body.generalCommitQualityLevel[1].qualityLevelCount).toBe(1);
        expect(body.generalCommitQualityLevel[2].qualityLevelCount).toBe(3);
        expect(body.generalCommitQualityLevel[3].qualityLevelCount).toBe(2);
        expect(body.generalCommitQualityLevel[4].qualityLevelCount).toBe(1);

        expect(body.commitQualityPerContributor).toHaveLength(2);

        expect(contributorsIds).toContain(contributorTestingSeed[0].id);
        expect(contributorsIds).toContain(contributorTestingSeed[1].id);

        const contributor1 = body.commitQualityPerContributor.find(
            (item) => item.contributor.id === contributorTestingSeed[0].id
        );
        const contributor2 = body.commitQualityPerContributor.find(
            (item) => item.contributor.id === contributorTestingSeed[1].id
        );

        expect(contributor1?.commitQualityLevel).toStrictEqual([
            {
                qualityLevel: 0,
                qualityLevelCount: 1,
            },
            {
                qualityLevel: 1,
                qualityLevelCount: 1,
            },
            {
                qualityLevel: 2,
                qualityLevelCount: 2,
            },
            {
                qualityLevel: 3,
                qualityLevelCount: 1,
            },
            {
                qualityLevel: 4,
                qualityLevelCount: 1,
            },
        ]);

        expect(contributor2?.commitQualityLevel).toStrictEqual([
            {
                qualityLevel: 2,
                qualityLevelCount: 1,
            },
            {
                qualityLevel: 3,
                qualityLevelCount: 1,
            },
        ]);
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/commit-quality")
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/commit-quality")
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/commit-quality")
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});

describe("GET /repository/:id/metric/issues", () => {
    const authUser = generateToken(1);

    it("should return 422 when search param startedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/issues?startedAt=abc`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.startedAt"]?.message).toBe(
            "startedAt must be a valid date"
        );
    });

    it("should return 422 when search param endedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/issues?endedAt=abc`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.endedAt"]?.message).toBe(
            "endedAt must be a valid date"
        );
    });

    it("should return 422 when search param startedAt is greater than endedAt", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/issues?startedAt=2021-01-01&endedAt=2020-01-01`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.startedAt"]?.message).toBe(
            "startedAt must be less than or equal to endedAt"
        );
        expect(response.body.error?.["query.endedAt"]?.message).toBe(
            "endedAt must be greater than or equal to startedAt"
        );
        expect(response.body.message).toBe("Invalid date interval");
    });

    it("should return 404 when repository does not exist", async () => {
        const response = await supertest(app)
            .get("/repository/999/metric/issues")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe("Repository not found");
    });

    it("should return 200 when missing params, and default to startedAt = project's createdAt and endedAt = now", async () => {
        const response = await supertest(app)
            .get(`/repository/${repositoryTestingSeed[3].id}/metric/issues`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        const body: IssueMetricsDTO = response.body;
        const contributorsIds = body.issueDataPerContributor.map(
            (item) => item.contributor.id
        );

        expect(body.issuesOpennedCount).toBe(5);
        expect(body.issuesClosedCount).toBe(1);

        expect(body.issueDataPerContributor).toHaveLength(2);

        expect(contributorsIds).toContain(contributorTestingSeed[0].id);
        expect(contributorsIds).toContain(contributorTestingSeed[1].id);

        const contributor1 = body.issueDataPerContributor.find(
            (item) => item.contributor.id === contributorTestingSeed[0].id
        );
        const contributor2 = body.issueDataPerContributor.find(
            (item) => item.contributor.id === contributorTestingSeed[1].id
        );

        expect(contributor1?.assignedIssuesCount).toBe(2);
        expect(contributor1?.authoredIssuesCount).toBe(3);

        expect(contributor2?.assignedIssuesCount).toBe(3);
        expect(contributor2?.authoredIssuesCount).toBe(1);
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/issues")
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/issues")
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/issues")
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});

describe("GET /repository/:id/metric/file-types", () => {
    const authUser = generateToken(1);

    it("should return 422 when search param startedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/file-types?startedAt=abc`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.startedAt"]?.message).toBe(
            "startedAt must be a valid date"
        );
    });

    it("should return 422 when search param endedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/file-types?endedAt=abc`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.endedAt"]?.message).toBe(
            "endedAt must be a valid date"
        );
    });

    it("should return 422 when search param startedAt is greater than endedAt", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/file-types?startedAt=2021-01-01&endedAt=2020-01-01`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.startedAt"]?.message).toBe(
            "startedAt must be less than or equal to endedAt"
        );
        expect(response.body.error?.["query.endedAt"]?.message).toBe(
            "endedAt must be greater than or equal to startedAt"
        );
        expect(response.body.message).toBe("Invalid date interval");
    });

    it("should return 404 when repository does not exist", async () => {
        const response = await supertest(app)
            .get("/repository/999/metric/file-types")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe("Repository not found");
    });

    it("should return 200 when missing params, and default to startedAt = project's createdAt and endedAt = now", async () => {
        const response = await supertest(app)
            .get(`/repository/${repositoryTestingSeed[0].id}/metric/file-types`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        const body: FileTypeMetricsDTO = response.body;
        const contributorsIds = body.perContributor.map(
            (item) => item.contributor.id
        );

        expect(body.general).toHaveLength(3);
        expect(body.general).toContainEqual({
            count: 3,
            extension: "ts",
        });
        expect(body.general).toContainEqual({
            count: 2,
            extension: "html",
        });
        expect(body.general).toContainEqual({
            count: 1,
            extension: "css",
        });

        expect(body.perContributor).toHaveLength(3);

        expect(contributorsIds).toContainEqual(contributorTestingSeed[0].id);
        expect(contributorsIds).toContainEqual(contributorTestingSeed[1].id);
        expect(contributorsIds).toContainEqual(contributorTestingSeed[2].id);

        const contributor1 = body.perContributor.find(
            (item) => item.contributor.id === contributorTestingSeed[0].id
        );
        const contributor2 = body.perContributor.find(
            (item) => item.contributor.id === contributorTestingSeed[1].id
        );
        const contributor3 = body.perContributor.find(
            (item) => item.contributor.id === contributorTestingSeed[2].id
        );

        expect(contributor1?.fileTypes).toHaveLength(1);
        expect(contributor1?.fileTypes).toContainEqual({
            count: 2,
            extension: "ts",
        });

        expect(contributor2?.fileTypes).toHaveLength(1);
        expect(contributor2?.fileTypes).toContainEqual({
            count: 1,
            extension: "ts",
        });

        expect(contributor3?.fileTypes).toHaveLength(3);
        expect(contributor3?.fileTypes).toContainEqual({
            count: 2,
            extension: "ts",
        });
        expect(contributor3?.fileTypes).toContainEqual({
            count: 2,
            extension: "html",
        });
        expect(contributor3?.fileTypes).toContainEqual({
            count: 1,
            extension: "css",
        });
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/file-types")
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/file-types")
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/file-types")
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});

describe("GET /repository/:id/metric/changes", () => {
    const authUser = generateToken(1);

    it("should return 422 when search param startedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/changes?startedAt=abc`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.startedAt"]?.message).toBe(
            "startedAt must be a valid date"
        );
    });

    it("should return 422 when search param endedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/changes?endedAt=abc`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.endedAt"]?.message).toBe(
            "endedAt must be a valid date"
        );
    });

    it("should return 422 when search param startedAt is greater than endedAt", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/changes?startedAt=2021-01-01&endedAt=2020-01-01`
            )
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(422)
            .send();

        expect(response.body.error?.["query.startedAt"]?.message).toBe(
            "startedAt must be less than or equal to endedAt"
        );
        expect(response.body.error?.["query.endedAt"]?.message).toBe(
            "endedAt must be greater than or equal to startedAt"
        );
        expect(response.body.message).toBe("Invalid date interval");
    });

    it("should return 404 when repository does not exist", async () => {
        const response = await supertest(app)
            .get("/repository/999/metric/changes")
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(404)
            .send();

        expect(response.body.message).toBe("Repository not found");
    });

    it("should return 200 when missing params, and default to startedAt = project's createdAt and endedAt = now", async () => {
        const response = await supertest(app)
            .get(`/repository/${repositoryTestingSeed[0].id}/metric/changes`)
            .set("Authorization", `Bearer ${authUser.token}`)
            .expect(200)
            .send();

        const body: FileChangeMetricsDTO = response.body;
        const contributorsIds = body.fileChangesPerContributor.map(
            (item) => item.contribuitor.id
        );

        expect(body.fileCount).toBe(6);
        expect(body.totalAdditions).toBe(217);
        expect(body.totalDeletions).toBe(37);

        expect(body.fileChangesPerContributor).toHaveLength(3);

        expect(contributorsIds).toContainEqual(contributorTestingSeed[0].id);
        expect(contributorsIds).toContainEqual(contributorTestingSeed[1].id);
        expect(contributorsIds).toContainEqual(contributorTestingSeed[2].id);

        const contributor1 = body.fileChangesPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[0].id
        );
        const contributor2 = body.fileChangesPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[1].id
        );
        const contributor3 = body.fileChangesPerContributor.find(
            (item) => item.contribuitor.id === contributorTestingSeed[2].id
        );

        expect(contributor1?.addtions.sum).toBe(112);
        expect(contributor1?.deletions.sum).toBe(27);
        expect(contributor1?.fileCount).toBe(2);

        expect(contributor2?.addtions.sum).toBe(0);
        expect(contributor2?.deletions.sum).toBe(5);
        expect(contributor2?.fileCount).toBe(1);

        expect(contributor3?.addtions.sum).toBe(105);
        expect(contributor3?.deletions.sum).toBe(5);
        expect(contributor3?.fileCount).toBe(5);
    });

    it("should return 401 when no token is provided", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/changes")
            .expect(401)
            .send();

        expect(response.body.message).toBe("No authorization header provided");
    });

    it("should return 401 when token is not Bearer", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/changes")
            .set("Authorization", `Basic ${authUser.token}`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid authorization header");
    });

    it("should return 401 when token is invalid", async () => {
        const response = await supertest(app)
            .get("/repository/1/metric/changes")
            .set("Authorization", `Bearer invalid-token`)
            .expect(401)
            .send();

        expect(response.body.message).toBe("Invalid token");
    });
});
