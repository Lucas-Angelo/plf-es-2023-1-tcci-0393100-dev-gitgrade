import { DataTypes } from "sequelize";
import { CodeQualityStatus } from "../../model/CodeQuality";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable("code_quality", {
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
        url: {
            field: "url",
            type: DataTypes.STRING(1000),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        status: {
            field: "status",
            type: DataTypes.ENUM(
                CodeQualityStatus.ANALYZING,
                CodeQualityStatus.ANALYZED,
                CodeQualityStatus.ERROR
            ),
            allowNull: false,
        },
        createdAt: {
            field: "created_at",
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable("code_quality");
};
