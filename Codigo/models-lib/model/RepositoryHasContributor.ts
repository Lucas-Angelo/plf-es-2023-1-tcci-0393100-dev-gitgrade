import { Model, DataTypes, Sequelize } from "sequelize";

import { Contributor } from "./Contributor";
import { Repository } from "./Repository";
import { DatabaseConfig } from "../types/DatabaseConfig";

class RepositoryHasContributor extends Model {
    public repositoryId!: number;
    public contributorId!: number;

    static initModel(sequelize: Sequelize, databaseConfig: DatabaseConfig): void {
        this.init(
            {
                repositoryId: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
                contributorId: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
            },
            {
                tableName: "repository_has_contributor",
                ...databaseConfig,
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
            foreignKey: "contributorId",
            as: "contributor",
        });
    }
}

export { RepositoryHasContributor };
