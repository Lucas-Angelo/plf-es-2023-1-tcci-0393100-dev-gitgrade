import logger from "../config/LogConfig";
import { File, IFileAttributes } from "../model/File";
import { SequelizeUtil } from "../util/SequelizeUtil";

class FileService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    async createOrUpdate(data: IFileAttributes): Promise<File> {
        if (!data.path) {
            logger.error("File path is required.", { data });
            throw new Error("File path is required.");
        }
        if (!data.commitId) {
            logger.error("Commit id is required.", { data });
            throw new Error("Commit id is required.");
        }

        const existingFile = await this.findOneByFields({
            commitId: data.commitId,
            path: data.path,
        });

        if (existingFile) return await this.update(existingFile, data);
        else return await this.create(data);
    }

    async create(data: IFileAttributes): Promise<File> {
        try {
            this.validateNotNullFields(data);
            data.additions
                ? (data.additions = data.additions)
                : (data.additions = 0);
            data.deletions
                ? (data.deletions = data.deletions)
                : (data.deletions = 0);
            logger.info("Creating file:", { data });
            const file = await File.create(data);
            logger.info("File created:", { file });
            return file;
        } catch (error) {
            logger.error("Error creating file:", { data, error });
            throw error;
        }
    }

    async update(existingFile: File, data: IFileAttributes): Promise<File> {
        try {
            this.validateNotNullFields(data);
            data.additions
                ? (data.additions += existingFile.additions)
                : (data.additions = existingFile.additions);
            data.deletions
                ? (data.deletions += existingFile.deletions)
                : (data.deletions = existingFile.deletions);
            logger.info("Updating file:", { existingFile, newData: data });
            const updatedFile = await existingFile.update(data);
            logger.info("File updated:", { updatedFile });
            return updatedFile;
        } catch (error) {
            logger.error("Error updating file:", { existingFile, data, error });
            throw error;
        }
    }

    async findOneByFields(
        fields: Partial<IFileAttributes>
    ): Promise<File | null> {
        try {
            logger.info(`Searching for file by fields:`, { fields });
            const file = await File.findOne({ where: { ...fields } });

            if (!file)
                logger.info(
                    `File not found by fields ${JSON.stringify(
                        fields
                    )}. Returning null.`
                );
            else
                logger.info(`File found by fields ${JSON.stringify(fields)}:`, {
                    file,
                });

            return file;
        } catch (error) {
            logger.error(
                `Error finding file by fields ${JSON.stringify(fields)}:`,
                { error }
            );
            throw error;
        }
    }

    async deleteByFields(fields: Partial<IFileAttributes>): Promise<void> {
        try {
            logger.info(`Deleting file by fields:`, { fields });
            const file = await File.findOne({ where: { ...fields } });

            if (!file) {
                logger.info(
                    `File not found by fields ${JSON.stringify(
                        fields
                    )}. Returning.`
                );
                return;
            }

            logger.info(`File found by fields ${JSON.stringify(fields)}:`, {
                file,
            });

            await file.destroy();
            logger.info(`File deleted by fields ${JSON.stringify(fields)}:`);
        } catch (error) {
            logger.error(
                `Error deleting file by fields ${JSON.stringify(fields)}:`,
                { error }
            );
            throw error;
        }
    }

    private validateNotNullFields(data: IFileAttributes): void {
        const missingFields = this.sequelizeUtil.getMissingFields(File, data);

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(
                ", "
            )}`;
            logger.error(errorMessage, { data });
            throw new Error(errorMessage);
        } else logger.info("All required fields are present.");
    }
}

export { FileService };
