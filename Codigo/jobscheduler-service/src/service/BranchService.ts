import logger from "../config/LogConfig";
import { Branch, IBranchAttributes } from "../model/Branch";
import { SequelizeUtil } from "../util/SequelizeUtil";

class BranchService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    async createOrUpdate(data: IBranchAttributes): Promise<Branch> {
        if (!data.name) throw new Error("Branch name is required.");

        const existingBranch = await this.findOneByFields({
            repositoryId: data.repositoryId,
            name: data.name,
        });

        if (existingBranch) {
            logger.info("Branch already exists. Updating branch:", data);
            return await this.update(existingBranch, data);
        } else {
            logger.info("Branch does not exist. Creating branch:", data);
            return await this.create(data);
        }
    }

    async create(data: IBranchAttributes): Promise<Branch> {
        try {
            this.validateNotNullFields(data);
            logger.info("Creating branch:", data);
            const branch = await Branch.create(data);
            logger.info("Branch created:", {
                branch,
            });
            return branch;
        } catch (error) {
            logger.error("Error creating branch:", {
                data,
                error,
            });
            throw error;
        }
    }

    async update(
        existingBranch: Branch,
        data: IBranchAttributes
    ): Promise<Branch> {
        try {
            this.validateNotNullFields(data);
            logger.info("Updating branch:", {
                existingBranch,
                newData: data,
            });
            const updatedBranch = await existingBranch.update(data);
            logger.info("Branch updated:", {
                updatedBranch,
            });
            return updatedBranch;
        } catch (error) {
            logger.error("Error updating branch:", {
                existingBranch,
                data,
                error,
            });
            throw error;
        }
    }

    async findOneByField(
        field: keyof IBranchAttributes,
        value: IBranchAttributes[keyof IBranchAttributes]
    ): Promise<Branch | null> {
        try {
            logger.info(`Searching for branch by ${String(field)} ${value}`);
            const branch = await Branch.findOne({
                where: { [field]: value },
            });
            if (!branch)
                logger.info(
                    `Branch not found by ${String(
                        field
                    )} ${value}. Returning null.`
                );
            else
                logger.info(
                    `Branch found by ${String(field)} ${value}:`,
                    branch
                );

            return branch;
        } catch (error) {
            logger.error(
                `Error finding branch by ${String(field)} ${value}:`,
                error
            );
            throw error;
        }
    }

    async findOneByFields(
        fields: Partial<IBranchAttributes>
    ): Promise<Branch | null> {
        try {
            logger.info(`Searching for branch by fields:`, fields);
            const branch = await Branch.findOne({
                where: { ...fields },
            });
            if (!branch)
                logger.info(
                    `Branch not found by fields ${JSON.stringify(
                        fields
                    )}. Returning null.`
                );
            else
                logger.info(
                    `Branch found by fields ${JSON.stringify(fields)}:`,
                    branch
                );

            return branch;
        } catch (error) {
            logger.error(
                `Error finding branch by fields ${JSON.stringify(fields)}:`,
                error
            );
            throw error;
        }
    }

    async findAllByField(
        field: keyof IBranchAttributes,
        value: IBranchAttributes[keyof IBranchAttributes]
    ): Promise<Branch[]> {
        try {
            logger.info(`Searching for branches by ${String(field)} ${value}`);
            const branches = await Branch.findAll({
                where: { [field]: value },
            });
            logger.info(
                `Branches found by ${String(field)} ${value}:`,
                branches
            );
            return branches;
        } catch (error) {
            logger.error(
                `Error finding branches by ${String(field)} ${value}:`,
                error
            );
            throw error;
        }
    }

    private validateNotNullFields(data: IBranchAttributes): void {
        const missingFields = this.sequelizeUtil.getMissingFields(Branch, data);

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(
                ", "
            )}`;
            logger.error(errorMessage, data);
            throw new Error(errorMessage);
        } else logger.info("All required fields are present.");
    }
}

export { BranchService };
