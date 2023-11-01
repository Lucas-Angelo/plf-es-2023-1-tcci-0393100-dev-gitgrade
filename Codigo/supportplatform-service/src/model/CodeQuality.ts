import { DataTypes, Model, Sequelize } from "sequelize";
import EnvConfig from "../config/EnvConfig";
import { Repository } from "./Repository";

enum CodeQualityStatus {
    ANALYZING = "ANALYZING",
    ANALYZED = "ANALYZED",
    ERROR = "ERROR",
}

interface ICodeQualityAttributes {
    id?: number;
    repositoryId?: number;
    url?: string;
    status?: CodeQualityStatus;
    createdAt?: Date;
}

class CodeQuality extends Model<ICodeQualityAttributes> {
    public id!: number;
    public repositoryId!: number;
    public url!: string;
    public status!: "ANALYZING" | "ANALYZED" | "ERROR";
    public createdAt!: Date;

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
                    type: DataTypes.ENUM("ANALYZING", "ANALYZED", "ERROR"),
                    allowNull: false,
                },
                createdAt: {
                    field: "created_at",
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                tableName: "code_quality",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
            }
        );
    }

    static associate(models: { Repository: typeof Repository }): void {
        this.belongsTo(models.Repository, {
            foreignKey: "repositoryId",
            as: "repository",
        });
    }
}

export { CodeQuality, CodeQualityStatus, ICodeQualityAttributes };
