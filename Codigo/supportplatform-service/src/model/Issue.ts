import { DataTypes, Model, Sequelize } from "sequelize";

import EnvConfig from "../config/EnvConfig";

import { Contributor } from "./Contributor";
import { IssueHasAssigneeContributor } from "./IssueHasAssigneeContributor";
import { Repository } from "./Repository";

interface IIssueAttributes {
    id?: number;
    repositoryId?: number;
    authorContributorId?: number | null;
    githubId?: string | null;
    number?: number;
    title?: string | null;
    githubCreatedAt?: Date;
    githubUpdatedAt?: Date;
    githubClosedAt?: Date | null;
    closed?: boolean;
}

class Issue extends Model<IIssueAttributes> {
    public id!: number;
    public repositoryId!: number;
    public authorContributorId!: number | null;
    public githubId!: string;
    public number!: number;
    public title!: string | null;
    public githubCreatedAt!: Date;
    public githubUpdatedAt!: Date;
    public githubClosedAt!: Date | null;
    public closed!: boolean;

    public author!: Contributor;
    public assignees!: Contributor[];

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
                    references: {
                        model: Repository,
                        key: "id",
                    },
                },
                authorContributorId: {
                    field: "author_contributor_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: true,
                    references: {
                        model: Contributor,
                        key: "id",
                    },
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
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    unique: false,
                },
                title: {
                    field: "title",
                    type: DataTypes.STRING(16000),
                    allowNull: true,
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
                closed: {
                    field: "closed",
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
            },
            {
                tableName: "issue",
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
            through: IssueHasAssigneeContributor,
            foreignKey: "issueId",
            otherKey: "assigneeContributorId",
            as: "assignees",
        });
        this.hasMany(IssueHasAssigneeContributor, {
            foreignKey: "issueId",
        });
    }
}

export { IIssueAttributes, Issue };
