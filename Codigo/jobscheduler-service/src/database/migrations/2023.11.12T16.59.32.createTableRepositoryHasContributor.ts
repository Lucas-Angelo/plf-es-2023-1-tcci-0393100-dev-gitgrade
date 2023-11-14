import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(
        "repository_has_contributor",
        {
            repositoryId: {
                field: "repository_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "repository",
                    key: "id",
                },
            },
            contributorId: {
                field: "contributor_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "contributor",
                    key: "id",
                },
            },
        },
        {
            charset: EnvConfig.DB_CHARSET,
            collate: EnvConfig.DB_COLLATE,
        }
    );
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable("repository_has_contributor");
};
