import logger from "../config/LogConfig";
import { Commit, ICommitAttributes } from "../model/Commit";
import { SequelizeUtil } from "../util/SequelizeUtil";

class CommitService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    async createOrUpdate(data: ICommitAttributes): Promise<Commit> {
        if (!data.sha) throw new Error("Commit sha is required.");

        const existingCommit = await this.findOneByFields({
            branchId: data.branchId,
            sha: data.sha,
        });

        if (existingCommit) {
            logger.info("Commit already exists. Updating commit:", data);
            return await this.update(existingCommit, data);
        } else {
            logger.info("Commit does not exist. Creating commit:", data);
            return await this.create(data);
        }
    }

    async create(data: ICommitAttributes): Promise<Commit> {
        try {
            this.validateNotNullFields(data);
            logger.info("Creating commit:", data);
            const commit = await Commit.create(data);
            logger.info("Commit created:", {
                commit,
            });
            return commit;
        } catch (error) {
            logger.error("Error creating commit:", {
                data,
                error,
            });
            throw error;
        }
    }

    async update(
        existingCommit: Commit,
        data: ICommitAttributes
    ): Promise<Commit> {
        try {
            this.validateNotNullFields(data);
            logger.info("Updating commit:", {
                existingCommit,
                newData: data,
            });
            const updatedCommit = await existingCommit.update(data);
            logger.info("Commit updated:", {
                updatedCommit,
            });
            return updatedCommit;
        } catch (error) {
            logger.error("Error updating commit:", {
                existingCommit,
                data,
                error,
            });
            throw error;
        }
    }

    async findOneByField(
        field: keyof ICommitAttributes,
        value: ICommitAttributes[keyof ICommitAttributes]
    ): Promise<Commit | null> {
        try {
            logger.info(`Searching for commit by ${String(field)} ${value}`);
            const commit = await Commit.findOne({
                where: { [field]: value },
            });
            if (!commit)
                logger.info(
                    `Commit not found by ${String(
                        field
                    )} ${value}. Returning null.`
                );
            else
                logger.info(
                    `Commit found by ${String(field)} ${value}:`,
                    commit
                );

            return commit;
        } catch (error) {
            logger.error(
                `Error finding commit by ${String(field)} ${value}:`,
                error
            );
            throw error;
        }
    }

    async findOneByFields(
        fields: Partial<ICommitAttributes>
    ): Promise<Commit | null> {
        try {
            logger.info(`Searching for commit by fields:`, fields);
            const commit = await Commit.findOne({
                where: { ...fields },
            });
            if (!commit)
                logger.info(
                    `Commit not found by fields ${JSON.stringify(
                        fields
                    )}. Returning null.`
                );
            else
                logger.info(
                    `Commit found by fields ${JSON.stringify(fields)}:`,
                    commit
                );

            return commit;
        } catch (error) {
            logger.error(
                `Error finding commit by fields ${JSON.stringify(fields)}:`,
                error
            );
            throw error;
        }
    }

    private validateNotNullFields(data: ICommitAttributes): void {
        const missingFields = this.sequelizeUtil.getMissingFields(Commit, data);

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(
                ", "
            )}`;
            logger.error(errorMessage, data);
            throw new Error(errorMessage);
        } else logger.info("All required fields are present.");
    }

    async findAllByField(
        field: keyof ICommitAttributes,
        value: ICommitAttributes[keyof ICommitAttributes]
    ): Promise<Commit[]> {
        try {
            logger.info(`Searching for commits by ${String(field)} ${value}`);
            const commits = await Commit.findAll({
                where: { [field]: value },
            });
            logger.info(`Commits found by ${String(field)} ${value}:`, commits);
            return commits;
        } catch (error) {
            logger.error(
                `Error finding commits by ${String(field)} ${value}:`,
                error
            );
            throw error;
        }
    }
}

export { CommitService };
