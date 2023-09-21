import { Branch } from "../../model/Branch";
import { Commit } from "../../model/Commit";
import { Contributor } from "../../model/Contributor";
import { File } from "../../model/File";
import { Issue } from "../../model/Issue";
import { IssueHasAssigneeContributor } from "../../model/IssueHasAssigneeContributor";
import { Repository } from "../../model/Repository";
import { RepositoryHasContributor } from "../../model/RepositoryHasContributor";
import { branchTestingSeed } from "../seed/branch";
import { commitTestingSeed } from "../seed/commit";
import { contributorTestingSeed } from "../seed/contributor";
import { fileTestingSeed } from "../seed/file";
import { issueTestingSeed } from "../seed/issue";
import { issueHasAssigneeTestingSeed } from "../seed/issueHasAssigne";
import { repositoryTestingSeed } from "../seed/repository";
import { repositoryHasContributorSeed } from "../seed/repositoryHasContributor";

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
}
