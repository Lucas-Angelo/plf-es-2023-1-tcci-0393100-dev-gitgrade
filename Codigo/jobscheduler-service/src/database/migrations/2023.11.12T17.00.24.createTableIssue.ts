import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(
        "issue",
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
                    model: "repository",
                    key: "id",
                },
            },
            authorContributorId: {
                field: "author_contributor_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: "contributor",
                    key: "id",
                },
            },
            githubId: {
                field: "github_id",
                type: DataTypes.STRING(250),
                allowNull: false,
                unique: true,
            },
            number: {
                field: "number",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
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
            },
            githubUpdatedAt: {
                field: "github_updated_at",
                type: DataTypes.DATE,
                allowNull: false,
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
            charset: EnvConfig.DB_CHARSET,
            collate: EnvConfig.DB_COLLATE,
        }
    );
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable("issue");
};
