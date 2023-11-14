import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(
        "repository",
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
                references: {
                    model: "evaluation_method",
                    key: "id",
                },
            },
            githubId: {
                field: "github_id",
                type: DataTypes.STRING(250),
                allowNull: false,
                unique: true,
            },
            name: {
                field: "name",
                type: DataTypes.STRING(1000),
                allowNull: false,
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
            },
            githubUpdatedAt: {
                field: "github_updated_at",
                type: DataTypes.DATE,
                allowNull: false,
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
            charset: EnvConfig.DB_CHARSET,
            collate: EnvConfig.DB_COLLATE,
        }
    );
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable("repository");
};
