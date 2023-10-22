import { DataTypes, Model, Sequelize } from "sequelize";
import EnvConfig from "../config/EnvConfig";
import { EvaluationMethod } from "./EvaluationMethod";

interface ISprintAttributes {
    id?: number;
    evaluationMethodId: number;
    name: string;
    start_date: Date;
    end_date: Date;
}

class Sprint extends Model<ISprintAttributes> {
    public id!: number;
    public evaluationMethodId!: number;
    public name!: string;
    public start_date!: Date;
    public end_date!: Date;

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
                evaluationMethodId: {
                    field: "evaluation_method_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: EvaluationMethod,
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
                tableName: "sprint",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
            }
        );
    }

    static associate(models: {
        EvaluationMethod: typeof EvaluationMethod;
    }): void {
        this.belongsTo(models.EvaluationMethod, {
            foreignKey: "evaluationMethodId",
            as: "evaluation_method",
        });
        // hasMany CodeQuality
    }
}

export { ISprintAttributes, Sprint };
