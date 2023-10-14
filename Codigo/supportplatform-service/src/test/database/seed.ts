import { Branch } from "../../model/Branch";
import { Commit } from "../../model/Commit";
import { Contributor } from "../../model/Contributor";
import { ConsistencyRule } from "../../model/ConsistencyRule";
import { EvaluationMethod } from "../../model/EvaluationMethod";
import { File } from "../../model/File";
import { Issue } from "../../model/Issue";
import { IssueHasAssigneeContributor } from "../../model/IssueHasAssigneeContributor";
import { Repository } from "../../model/Repository";
import { RepositoryHasContributor } from "../../model/RepositoryHasContributor";
import { Sprint } from "../../model/Sprint";
import { branchTestingSeed } from "../seed/branch";
import { commitTestingSeed } from "../seed/commit";
import { contributorTestingSeed } from "../seed/contributor";

import { StandardizedIssue } from "../../model/StandardizedIssue";
import { consistencyRuleTestingSeed } from "../seed/consistencyRule";
import { evaluationMethodTestingSeed } from "../seed/evaluationMethod";
import { fileTestingSeed } from "../seed/file";
import { issueTestingSeed } from "../seed/issue";
import { issueHasAssigneeTestingSeed } from "../seed/issueHasAssigne";
import { repositoryTestingSeed } from "../seed/repository";
import { repositoryHasContributorSeed } from "../seed/repositoryHasContributor";
import { sprintTestingSeed } from "../seed/sprint";
import { standardizedIssueTestingSeed } from "../seed/standardizedIssue";

export async function seedDatabase() {
    await Repository.bulkCreate(repositoryTestingSeed, {});
    await Contributor.bulkCreate(contributorTestingSeed, {});
    await RepositoryHasContributor.bulkCreate(repositoryHasContributorSeed, {});
    await Branch.bulkCreate(branchTestingSeed, {});
    await Commit.bulkCreate(commitTestingSeed, {});
    await File.bulkCreate(fileTestingSeed, {});
    await Issue.bulkCreate(issueTestingSeed, {});
    await IssueHasAssigneeContributor.bulkCreate(
        issueHasAssigneeTestingSeed,
        {}
    );
    await EvaluationMethod.bulkCreate(evaluationMethodTestingSeed, {});
    await Sprint.bulkCreate(sprintTestingSeed, {});
    await StandardizedIssue.bulkCreate(standardizedIssueTestingSeed, {});
    await ConsistencyRule.bulkCreate(consistencyRuleTestingSeed, {});
}
