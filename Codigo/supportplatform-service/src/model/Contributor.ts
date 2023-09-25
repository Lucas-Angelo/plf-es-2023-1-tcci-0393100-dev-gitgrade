import { DataTypes, Model, Sequelize } from "sequelize";

import EnvConfig from "../config/EnvConfig";

import { Commit } from "./Commit";
import { Issue } from "./Issue";
import { IssueHasAssigneeContributor } from "./IssueHasAssigneeContributor";
import { PullRequest } from "./PullRequest";
import { PullRequestHasAssigneeContributor } from "./PullRequestHasAssigneeContributor";
import { Repository } from "./Repository";
import { RepositoryHasContributor } from "./RepositoryHasContributor";

interface IContributorAttributes {
    id?: number;
    githubId?: string;
    githubLogin?: string;
    githubEmail?: string | null;
    githubName?: string | null;
    githubAvatarUrl?: string | null;
}

class Contributor extends Model<IContributorAttributes> {
    public id!: number;
    public githubId!: string;
    public githubLogin!: string;
    public githubEmail!: string | null;
    public githubName!: string | null;
    public githubAvatarUrl!: string | null;

    static initModel(sequelize: Sequelize): void {
        this.init(
            {
                id: {
                    field: "id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    primaryKey: true,
                    unique: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                githubId: {
                    field: "github_id",
                    type: DataTypes.STRING(250),
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: true,
                    },
                },
                githubLogin: {
                    field: "github_login",
                    type: DataTypes.STRING(50),
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: true,
                    },
                },
                githubEmail: {
                    field: "github_email",
                    type: DataTypes.STRING(254),
                    allowNull: true,
                    unique: true,
                },
                githubName: {
                    field: "github_name",
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                },
                githubAvatarUrl: {
                    field: "github_avatar_url",
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                },
            },
            {
                tableName: "contributor",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
            }
        );
    }

    static associate(models: {
        Repository: typeof Repository;
        Commit: typeof Commit;
        Issue: typeof Issue;
        PullRequest: typeof PullRequest;
    }): void {
        this.belongsToMany(models.Repository, {
            foreignKey: "contributorId",
            as: "repositories",
            through: RepositoryHasContributor,
        });
        this.hasMany(models.Commit, {
            foreignKey: "contributor_id",
            as: "commits",
        });
        this.hasMany(models.Issue, {
            foreignKey: "authorContributorId",
            as: "authoredIssues",
        });
        this.hasMany(models.PullRequest, {
            foreignKey: "authorContributorId",
            as: "authoredPullRequests",
        });

        this.belongsToMany(models.Issue, {
            through: IssueHasAssigneeContributor,
            foreignKey: "assigneeContributorId",
            as: "assignedIssues",
        });
        this.belongsToMany(models.PullRequest, {
            through: PullRequestHasAssigneeContributor,
            foreignKey: "assigneeContributorId",
            as: "assignedPullRequests",
        });
    }
}

export { Contributor, IContributorAttributes };
