import { DataTypes } from "sequelize";
import EnvConfig from "../../config/EnvConfig";
import { ConsistencyRuleDeliveryStatus } from "../../model/ConsistencyRuleDelivery";
import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(
        "consistency_rule_delivery",
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
                    model: "consistency_rule",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            repositoryId: {
                field: "repository_id",
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "repository",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            deliveryAt: {
                field: "delivery_at",
                type: DataTypes.DATE,
                allowNull: true,
            },
            status: {
                field: "status",
                type: DataTypes.ENUM(
                    ConsistencyRuleDeliveryStatus.AWAITING_DELIVERY,
                    ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME,
                    ConsistencyRuleDeliveryStatus.DELIVERED_LATE,
                    ConsistencyRuleDeliveryStatus.NOT_DELIVERED,
                    ConsistencyRuleDeliveryStatus.DELIVERED_WITH_INVALIDITY
                ),
                allowNull: false,
            },
        },
        {
            charset: EnvConfig.DB_CHARSET,
            collate: EnvConfig.DB_COLLATE,
        }
    );

    await sequelize.getQueryInterface().addIndex("consistency_rule_delivery", {
        name: "cr_delivery_repo_id_cr_id_status_unique",
        unique: true,
        fields: ["repository_id", "consistency_rule_id", "status"],
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize
        .getQueryInterface()
        .removeIndex(
            "consistency_rule_delivery",
            "cr_delivery_repo_id_cr_id_status_unique"
        );
    await sequelize.getQueryInterface().dropTable("consistency_rule_delivery");
};
