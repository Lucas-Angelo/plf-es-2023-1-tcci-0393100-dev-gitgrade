import { DataTypes, Model, Sequelize } from "sequelize";

import EnvConfig from "../config/EnvConfig";

import { Contributor } from "./Contributor";
import { Repository } from "./Repository";

class RepositoryHasContributor extends Model {
    public repositoryId!: number;
    public contributorId!: number;

    static initModel(sequelize: Sequelize): void {
        this.init(
            {
                repositoryId: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "repository",
                        key: "id",
                    },
                },
                contributorId: {
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
                tableName: "repository_has_contributor",
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
            foreignKey: "contributorId",
            as: "contributor",
        });
    }
}

export { RepositoryHasContributor };
