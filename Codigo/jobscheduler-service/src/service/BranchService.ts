import logger from "../config/LogConfig";
import { Branch, IBranchAttributes } from "../model/Branch";
import { SequelizeUtil } from "../util/SequelizeUtil";

class BranchService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    async createOrUpdate(data: IBranchAttributes): Promise<Branch> {
        if (!data.name) {
            logger.error("Name is required.", {
                data,
            });
            throw new Error("Name is required.");
        }
        if (!data.repositoryId) {
            logger.error("RepositoryId is required.", {
                data,
            });
            throw new Error("RepositoryId is required.");
        }

        const existingBranch = await this.findOneByFields({
            repositoryId: data.repositoryId,
            name: data.name,
        });

        if (existingBranch) return await this.update(existingBranch, data);
        else return await this.create(data);
    }

    async create(data: IBranchAttributes): Promise<Branch> {
        try {
            this.validateNotNullFields(data);
            logger.info("Creating branch:", { data });
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

    async findOneByFields(
        fields: Partial<IBranchAttributes>
    ): Promise<Branch | null> {
        try {
            logger.info(`Searching for branch by fields:`, { fields });
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
                    { branch }
                );

            return branch;
        } catch (error) {
            logger.error(
                `Error finding branch by fields ${JSON.stringify(fields)}:`,
                { error }
            );
            throw error;
        }
    }

    async findAllByFields(
        fields: Partial<IBranchAttributes>
    ): Promise<Branch[]> {
        try {
            logger.info(`Searching for branches by fields:`, { fields });
            const branches = await Branch.findAll({
                where: { ...fields },
            });
            logger.info(`Branches found by fields:`, { branches });
            return branches;
        } catch (error) {
            logger.error(
                `Error finding branches by fields ${JSON.stringify(fields)}:`,
                { error }
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
            logger.error(errorMessage, { data });
            throw new Error(errorMessage);
        } else logger.info("All required fields are present.");
    }
}

export { BranchService };
