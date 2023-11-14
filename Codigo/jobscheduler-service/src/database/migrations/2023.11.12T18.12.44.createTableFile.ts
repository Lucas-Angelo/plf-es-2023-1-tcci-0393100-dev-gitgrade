import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(
        "file",
        {
            id: {
                field: "id",
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                unique: true,
                autoIncrement: true,
                allowNull: false,
            },
            commitId: {
                field: "commit_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "commit",
                    key: "id",
                },
            },
            path: {
                field: "path",
                type: DataTypes.STRING(16000),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            extension: {
                field: "extension",
                type: DataTypes.STRING(250),
                allowNull: true,
            },
            additions: {
                field: "additions",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            deletions: {
                field: "deletions",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            charset: EnvConfig.DB_CHARSET,
            collate: EnvConfig.DB_COLLATE,
        }
    );
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable("file");
};
