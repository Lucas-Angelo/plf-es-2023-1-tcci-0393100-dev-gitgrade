import { DataTypes, Model, Sequelize } from "sequelize";
import EnvConfig from "../config/EnvConfig";
import { ConsistencyRule } from "./ConsistencyRule";
import { Repository } from "./Repository";

interface IConsistencyRuleDeliveryAttributes {
    id?: number;
    consistencyRuleId: number;
    repositoryId: number;
    deliveryAt: Date;
}

class ConsistencyRuleDelivery extends Model<IConsistencyRuleDeliveryAttributes> {
    public id!: number;
    public consistencyRuleId!: number;
    public repositoryId!: number;
    public deliveryAt!: Date;

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
                consistencyRuleId: {
                    field: "consistency_rule_id",
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: ConsistencyRule,
                        key: "id",
                    },
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
                deliveryAt: {
                    field: "delivery_at",
                    type: DataTypes.DATE,
                    allowNull: false,
                },
            },
            {
                tableName: "consistency_rule_delivery",
                charset: EnvConfig.DB_CHARSET,
                collate: EnvConfig.DB_COLLATE,
                sequelize,
            }
        );
    }

    static associate(models: {
        ConsistencyRule: typeof ConsistencyRule;
        Repository: typeof Repository;
    }): void {
        this.belongsTo(models.ConsistencyRule, {
            foreignKey: "consistencyRuleId",
            as: "consistency_rule",
        });
        this.belongsTo(models.Repository, {
            foreignKey: "repositoryId",
            as: "repository",
        });
    }
}

export { ConsistencyRuleDelivery, IConsistencyRuleDeliveryAttributes };
