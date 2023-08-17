import { DataTypes, Model, Sequelize } from "sequelize";

import EnvConfig from "../config/EnvConfig";

import { Contributor } from "./Contributor";
import { PullRequestHasAssigneeContributor } from "./PullRequestHasAssigneeContributor";
import { Repository } from "./Repository";

interface IPullRequestAttributes {
    id?: number;
    repositoryId?: number;
    authorContributorId?: number | null;
    githubId?: string | null;
    number?: number;
    title?: string | null;
    githubCreatedAt?: Date;
    githubUpdatedAt?: Date;
    githubClosedAt?: Date | null;
    githubMergedAt?: Date | null;
    closed?: boolean;
    merged?: boolean;
}

class PullRequest extends Model<IPullRequestAttributes> {
    public id!: number;
    public repositoryId!: number;
    public authorContributorId!: number | null;
    public githubId!: string;
    public number!: number;
    public title!: string | null;
    public githubCreatedAt!: Date;
    public githubUpdatedAt!: Date;
    public githubClosedAt!: Date | null;
    public githubMergedAt!: Date | null;
    public closed!: boolean;
    public merged!: boolean;

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
                repositoryId: {
                    field: "repository_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                },
                authorContributorId: {
                    field: "author_contributor_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: true,
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
                number: {
                    field: "number",
                    type: DataTypes.BIGINT,
                    allowNull: false,
                },
                title: {
                    field: "title",
                    type: DataTypes.STRING(16000),
                    allowNull: true,
                    validate: {
                        notEmpty: true,
                    },
                },
                githubCreatedAt: {
                    field: "github_created_at",
                    type: DataTypes.DATE,
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                    },
                },
                githubUpdatedAt: {
                    field: "github_updated_at",
                    type: DataTypes.DATE,
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                    },
                },
                githubClosedAt: {
                    field: "github_closed_at",
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                githubMergedAt: {
                    field: "github_merged_at",
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                closed: {
                    field: "closed",
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                merged: {
                    field: "merged",
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
            },
            {
                tableName: "pull_request",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
            }
        );
    }

    static associate(models: {
        Repository: typeof Repository;
        Contributor: typeof Contributor;
    }): void {
        this.belongsTo(models.Repository, {
            foreignKey: "repositoryId",
            as: "repository",
        });
        this.belongsTo(models.Contributor, {
            foreignKey: "authorContributorId",
            as: "author",
        });
        this.belongsToMany(models.Contributor, {
            through: PullRequestHasAssigneeContributor,
            foreignKey: "pullRequestId",
            as: "assignees",
        });
    }
}

export { IPullRequestAttributes, PullRequest };
