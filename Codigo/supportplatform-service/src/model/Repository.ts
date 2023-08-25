import { DataTypes, Model, Sequelize } from "sequelize";

import EnvConfig from "../config/EnvConfig";

interface IRepositoryAttributes {
    id?: number;
    evaluationMethodId?: number | null;
    githubId?: string;
    name?: string;
    description?: string | null;
    stargazerCount?: number;
    forkCount?: number;
    githubCreatedAt?: Date | null;
    githubUpdatedAt?: Date | null;
    hasProjectsEnabled?: boolean;
    hasIssuesEnabled?: boolean;
    primaryLanguage?: string | null;
    licenseName?: string | null;
    defaultBranch?: string | null;
    automaticSynchronization?: boolean;
    synchronizing?: boolean;
    lastSyncAt?: Date | null;
}

class Repository extends Model<IRepositoryAttributes> {
    public id!: number;
    public evaluationMethodId!: number | null;
    public githubId!: string;
    public name!: string;
    public description!: string | null;
    public stargazerCount!: number;
    public forkCount!: number;
    public githubCreatedAt!: Date;
    public githubUpdatedAt!: Date;
    public hasProjectsEnabled!: boolean;
    public hasIssuesEnabled!: boolean;
    public primaryLanguage!: string | null;
    public licenseName!: string | null;
    public defaultBranch!: string | null;
    public automaticSynchronization!: boolean;
    public synchronizing!: boolean;
    public lastSyncAt!: Date | null;

    public static initModel(sequelize: Sequelize): void {
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
                evaluationMethodId: {
                    field: "evaluation_method_id",
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
                name: {
                    field: "name",
                    type: DataTypes.STRING(1000),
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                    },
                },
                description: {
                    field: "description",
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                stargazerCount: {
                    field: "stargazer_count",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                },
                forkCount: {
                    field: "fork_count",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
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
                hasProjectsEnabled: {
                    field: "has_projects_enabled",
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                hasIssuesEnabled: {
                    field: "has_issues_enabled",
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                primaryLanguage: {
                    field: "primary_language",
                    type: DataTypes.STRING(250),
                    allowNull: true,
                },
                licenseName: {
                    field: "license_name",
                    type: DataTypes.STRING(250),
                    allowNull: true,
                },
                defaultBranch: {
                    field: "default_branch",
                    type: DataTypes.STRING(250),
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                    },
                },
                automaticSynchronization: {
                    field: "automatic_synchronization",
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
                synchronizing: {
                    field: "synchronizing",
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                lastSyncAt: {
                    field: "last_sync_at",
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                tableName: "repository",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                timestamps: true, // Enable default timestamps (createdAt and updatedAt)
                createdAt: false, // Disable createdAt field if not needed
                updatedAt: "lastSyncAt", // Use lastSyncAt as the updatedAt field
                sequelize,
            }
        );
    }
}

export { IRepositoryAttributes, Repository };
