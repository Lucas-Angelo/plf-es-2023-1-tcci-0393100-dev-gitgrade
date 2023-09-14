import { DataTypes, Model, Sequelize } from "sequelize";

import EnvConfig from "../config/EnvConfig";

import { Commit } from "./Commit";

interface IFileAttributes {
    id?: number;
    commitId?: number;
    path?: string;
    extension?: string | null;
    additions?: number;
    deletions?: number;
}

class File extends Model<IFileAttributes> {
    public id!: number;
    public commitId!: number;
    public path!: string;
    public extension!: string | null;
    public additions!: number;
    public deletions!: number;

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
                commitId: {
                    field: "commit_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: Commit,
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
                tableName: "file",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
            }
        );
    }

    static associate(models: { Commit: typeof Commit }): void {
        this.belongsTo(models.Commit, {
            foreignKey: "commitId",
            as: "commit",
        });
    }
}

export { File, IFileAttributes };
