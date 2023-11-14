import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(
        "sprint",
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
                allowNull: false,
                references: {
                    model: "evaluation_method",
                    key: "id",
                },
            },
            name: {
                field: "name",
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            start_date: {
                field: "start_date",
                type: DataTypes.DATE,
                allowNull: false,
            },
            end_date: {
                field: "end_date",
                type: DataTypes.DATE,
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
    await sequelize.getQueryInterface().dropTable("sprint");
};
