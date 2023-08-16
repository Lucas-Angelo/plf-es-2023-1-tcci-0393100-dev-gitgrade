import { DataTypes, Model, Sequelize } from "sequelize";

import { Repository } from "./Repository";
import { DatabaseConfig } from "../types/DatabaseConfig";

interface IBranchAttributes {
    id?: number;
    repositoryId?: number;
    name?: string;
}

class Branch extends Model<IBranchAttributes> {
    public id!: number;
    public repositoryId!: number;
    public name!: string;

    static initModel(sequelize: Sequelize, databaseConfig: DatabaseConfig): void {
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
                name: {
                    field: "name",
                    type: DataTypes.STRING(250),
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                    },
                },
            },
            {
                tableName: "branch",
                ...databaseConfig,
                sequelize,
            }
        )
        {
            indexes: [
                {
                    name: "branch_repository_id_name_UNIQUE",
                    unique: true,
                    fields: ["repository_id", "name"],
                },
            ];
        }
    }

    static associate(models: { Repository: typeof Repository }): void {
        this.belongsTo(models.Repository, {
            foreignKey: "repositoryId",
            as: "repository",
        });
    }
}

export { Branch, IBranchAttributes };
