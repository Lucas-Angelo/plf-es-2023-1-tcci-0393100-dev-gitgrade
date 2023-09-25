import logger from "../config/LogConfig";
import { IUserAttributes, User } from "../model/User";
import { SequelizeUtil } from "../utils/SequelizeUtil";

class UserService {
    private sequelizeUtil: SequelizeUtil;

    constructor() {
        this.sequelizeUtil = new SequelizeUtil();
    }

    async createOrUpdate(data: IUserAttributes): Promise<User> {
        if (!data.githubId) {
            logger.error("githubId is required.", { data });
            throw new Error("githubId is required.");
        }

        const existingUser = await this.findOneByField(
            "githubId",
            data.githubId
        );

        if (existingUser) return await this.update(existingUser, data);
        else return await this.create(data);
    }

    async create(data: IUserAttributes): Promise<User> {
        try {
            this.validateNotNullFields(data);
            logger.info("Creating user:", { data });
            const user = await User.create(data);
            logger.info("User created:", {
                user,
            });
            return user;
        } catch (error) {
            logger.error("Error creating user:", {
                data,
                error,
            });
            throw error;
        }
    }

    async update(existingUser: User, data: IUserAttributes): Promise<User> {
        try {
            this.validateNotNullFields(data);
            logger.info("Updating user:", {
                existingUser,
                newData: data,
            });
            const updatedUser = await existingUser.update(data);
            logger.info("User updated:", {
                updatedUser,
            });
            return updatedUser;
        } catch (error) {
            logger.error("Error updating user:", {
                existingUser,
                data,
                error,
            });
            throw error;
        }
    }

    async findOneByField(
        field: keyof IUserAttributes,
        value: IUserAttributes[keyof IUserAttributes]
    ): Promise<User | null> {
        try {
            logger.info(`Searching for user by ${field} ${value}`);
            const user = await User.findOne({
                where: { [field]: value },
            });
            if (!user)
                logger.info(
                    `User not found by ${field} ${value}. Returning null.`
                );
            else
                logger.info(`User found by ${field} ${value}:`, {
                    user,
                });

            return user;
        } catch (error) {
            logger.error(`Error finding user by ${field} ${value}:`, {
                error,
            });
            throw error;
        }
    }

    private validateNotNullFields(data: IUserAttributes): void {
        const missingFields = this.sequelizeUtil.getMissingFields(User, data);

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(
                ", "
            )}`;
            logger.error(errorMessage, { data });
            throw new Error(errorMessage);
        } else logger.info("All required fields are present.");
    }
}

export { UserService };
