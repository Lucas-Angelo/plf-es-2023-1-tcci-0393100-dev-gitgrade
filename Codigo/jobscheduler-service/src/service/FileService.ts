import logger from "../config/LogConfig";
import { File, IFileAttributes } from "../model/File";
import { SequelizeUtil } from "../util/SequelizeUtil";

class FileService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    async createOrUpdate(data: IFileAttributes): Promise<File> {
        if (!data.path) throw new Error("File path is required.");

        const existingFile = await this.findOneByFields({
            commitId: data.commitId,
            path: data.path,
        });

        if (existingFile) {
            logger.info("File already exists. Updating file:", data);
            return await this.update(existingFile, data);
        } else {
            logger.info("File does not exist. Creating file:", data);
            return await this.create(data);
        }
    }

    async create(data: IFileAttributes): Promise<File> {
        try {
            this.validateNotNullFields(data);
            logger.info("Creating file:", data);
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
            logger.info("Updating file:", { existingFile, newData: data });
            const updatedFile = await existingFile.update(data);
            logger.info("File updated:", { updatedFile });
            return updatedFile;
        } catch (error) {
            logger.error("Error updating file:", { existingFile, data, error });
            throw error;
        }
    }

    async findOneByField(
        field: keyof IFileAttributes,
        value: IFileAttributes[keyof IFileAttributes]
    ): Promise<File | null> {
        try {
            logger.info(`Searching for file by ${String(field)} ${value}`);
            const file = await File.findOne({ where: { [field]: value } });

            if (!file)
                logger.info(
                    `File not found by ${String(
                        field
                    )} ${value}. Returning null.`
                );
            else logger.info(`File found by ${String(field)} ${value}:`, file);

            return file;
        } catch (error) {
            logger.error(
                `Error finding file by ${String(field)} ${value}:`,
                error
            );
            throw error;
        }
    }

    async findOneByFields(
        fields: Partial<IFileAttributes>
    ): Promise<File | null> {
        try {
            logger.info(`Searching for file by fields:`, fields);
            const file = await File.findOne({ where: { ...fields } });

            if (!file)
                logger.info(
                    `File not found by fields ${JSON.stringify(
                        fields
                    )}. Returning null.`
                );
            else
                logger.info(
                    `File found by fields ${JSON.stringify(fields)}:`,
                    file
                );

            return file;
        } catch (error) {
            logger.error(
                `Error finding file by fields ${JSON.stringify(fields)}:`,
                error
            );
            throw error;
        }
    }

    async deleteByFields(fields: Partial<IFileAttributes>): Promise<void> {
        try {
            logger.info(`Deleting file by fields:`, fields);
            const file = await File.findOne({ where: { ...fields } });

            if (!file) {
                logger.info(
                    `File not found by fields ${JSON.stringify(
                        fields
                    )}. Returning.`
                );
                return;
            }

            logger.info(
                `File found by fields ${JSON.stringify(fields)}:`,
                file
            );

            await file.destroy();
            logger.info(`File deleted by fields ${JSON.stringify(fields)}:`);
        } catch (error) {
            logger.error(
                `Error deleting file by fields ${JSON.stringify(fields)}:`,
                error
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
            logger.error(errorMessage, data);
            throw new Error(errorMessage);
        } else logger.info("All required fields are present.");
    }
}

export { FileService };
