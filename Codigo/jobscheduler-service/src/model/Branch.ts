import { DataTypes, Model, Sequelize } from "sequelize";
import EnvConfig from "../config/EnvConfig";
import { Commit } from "./Commit";
import { Repository } from "./Repository";

interface IBranchAttributes {
    id?: number;
    repositoryId?: number;
    name?: string;
    commitAutomaticSynchronization?: boolean;
    fileAutomaticSynchronization?: boolean;
}

class Branch extends Model<IBranchAttributes> {
    public id!: number;
    public repositoryId!: number;
    public name!: string;
    public commitAutomaticSynchronization!: boolean;
    public fileAutomaticSynchronization!: boolean;

    static initModel(sequelize: Sequelize): void {
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
                    references: {
                        model: Repository,
                        key: "id",
                    },
                },
                name: {
                    field: "name",
                    type: DataTypes.STRING(250),
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                    },
                },
                commitAutomaticSynchronization: {
                    field: "commit_automatic_synchronization",
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                fileAutomaticSynchronization: {
                    field: "file_automatic_synchronization",
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
            },
            {
                tableName: "branch",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
                indexes: [
                    {
                        name: "branch_repository_id_name_UNIQUE",
                        unique: true,
                        fields: ["repository_id", "name"],
                    },
                ],
            }
        );
    }

    static associate(models: {
        Repository: typeof Repository;
        Commit: typeof Commit;
    }): void {
        this.belongsTo(models.Repository, {
            foreignKey: "repositoryId",
            as: "repository",
        });
        this.hasMany(models.Commit, {
            foreignKey: "branch_id",
            as: "commits",
        });
    }
}

export { Branch, IBranchAttributes };
