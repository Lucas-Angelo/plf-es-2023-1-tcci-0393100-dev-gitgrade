import supertest from "supertest";
import app from "../..";
import { repositoryTestingSeed } from "../seed/repository";
import {
    CommitMetricsDTO,
    CommitQualityMetricsDTO,
    FileTypeMetricsDTO,
    IssueMetricsDTO,
} from "@gitgrade/dtos";
import { contributorTestingSeed } from "../seed/contributor";
import Database from "../../database";

beforeAll(async () => {
    await new Database().connect();
});

describe("GET /repository/:id/metric/commit", () => {
    it("should return 422 when search param startedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit?startedAt=abc`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.startedAt"]?.message).toBe(
            "startedAt must be a valid date"
        );
    });

    it("should return 422 when search param endedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit?endedAt=abc`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.endedAt"]?.message).toBe(
            "endedAt must be a valid date"
        );
    });

    it("should return 422 when search param startedAt is greater than endedAt", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit?startedAt=2021-01-01&endedAt=2020-01-01`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.startedAt"]?.message).toBe(
            "startedAt must be less than or equal to endedAt"
        );
        expect(response.body.details?.["query.endedAt"]?.message).toBe(
            "endedAt must be greater than or equal to startedAt"
        );
        expect(response.body.message).toBe("Invalid date interval");
    });

    it("should return 404 when repository does not exist", async () => {
        const response = await supertest(app)
            .get("/repository/999/metric/commit")
            .expect(404)
            .send();

        expect(response.body.message).toBe("Repository not found");
    });

    it("should return 200 when missing params, and default to startedAt = project's createdAt, endedAt = now and branch = project's default", async () => {
        const response = await supertest(app)
            .get(`/repository/${repositoryTestingSeed[0].id}/metric/commit`)
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
});

describe("GET /repository/:id/metric/commit-quality", () => {
    it("should return 422 when search param startedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit-quality?startedAt=abc`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.startedAt"]?.message).toBe(
            "startedAt must be a valid date"
        );
    });

    it("should return 422 when search param endedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit-quality?endedAt=abc`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.endedAt"]?.message).toBe(
            "endedAt must be a valid date"
        );
    });

    it("should return 422 when search param startedAt is greater than endedAt", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/commit-quality?startedAt=2021-01-01&endedAt=2020-01-01`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.startedAt"]?.message).toBe(
            "startedAt must be less than or equal to endedAt"
        );
        expect(response.body.details?.["query.endedAt"]?.message).toBe(
            "endedAt must be greater than or equal to startedAt"
        );
        expect(response.body.message).toBe("Invalid date interval");
    });

    it("should return 404 when repository does not exist", async () => {
        const response = await supertest(app)
            .get("/repository/999/metric/commit-quality")
            .expect(404)
            .send();

        expect(response.body.message).toBe("Repository not found");
    });

    it("should return 200 when missing params, and default to startedAt = project's createdAt, endedAt = now and branch = project's default", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[3].id}/metric/commit-quality`
            )
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
});

describe("GET /repository/:id/metric/issues", () => {
    it("should return 422 when search param startedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/issues?startedAt=abc`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.startedAt"]?.message).toBe(
            "startedAt must be a valid date"
        );
    });

    it("should return 422 when search param endedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/issues?endedAt=abc`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.endedAt"]?.message).toBe(
            "endedAt must be a valid date"
        );
    });

    it("should return 422 when search param startedAt is greater than endedAt", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/issues?startedAt=2021-01-01&endedAt=2020-01-01`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.startedAt"]?.message).toBe(
            "startedAt must be less than or equal to endedAt"
        );
        expect(response.body.details?.["query.endedAt"]?.message).toBe(
            "endedAt must be greater than or equal to startedAt"
        );
        expect(response.body.message).toBe("Invalid date interval");
    });

    it("should return 404 when repository does not exist", async () => {
        const response = await supertest(app)
            .get("/repository/999/metric/issues")
            .expect(404)
            .send();

        expect(response.body.message).toBe("Repository not found");
    });

    it("should return 200 when missing params, and default to startedAt = project's createdAt and endedAt = now", async () => {
        const response = await supertest(app)
            .get(`/repository/${repositoryTestingSeed[3].id}/metric/issues`)
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
});

describe("GET /repository/:id/metric/file-types", () => {
    it("should return 422 when search param startedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/file-types?startedAt=abc`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.startedAt"]?.message).toBe(
            "startedAt must be a valid date"
        );
    });

    it("should return 422 when search param endedAt is not a date", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/file-types?endedAt=abc`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.endedAt"]?.message).toBe(
            "endedAt must be a valid date"
        );
    });

    it("should return 422 when search param startedAt is greater than endedAt", async () => {
        const response = await supertest(app)
            .get(
                `/repository/${repositoryTestingSeed[0].id}/metric/file-types?startedAt=2021-01-01&endedAt=2020-01-01`
            )
            .expect(422)
            .send();

        expect(response.body.details?.["query.startedAt"]?.message).toBe(
            "startedAt must be less than or equal to endedAt"
        );
        expect(response.body.details?.["query.endedAt"]?.message).toBe(
            "endedAt must be greater than or equal to startedAt"
        );
        expect(response.body.message).toBe("Invalid date interval");
    });

    it("should return 404 when repository does not exist", async () => {
        const response = await supertest(app)
            .get("/repository/999/metric/file-types")
            .expect(404)
            .send();

        expect(response.body.message).toBe("Repository not found");
    });

    it("should return 200 when missing params, and default to startedAt = project's createdAt and endedAt = now", async () => {
        const response = await supertest(app)
            .get(`/repository/${repositoryTestingSeed[0].id}/metric/file-types`)
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
});
