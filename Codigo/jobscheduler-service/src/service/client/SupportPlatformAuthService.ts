import axios from "axios";
import EnvConfig from "../../config/EnvConfig";
import logger from "../../config/LogConfig";
import AppError from "../../error/AppError";

interface GetPublicKeyResponseDTO {
    publicKey: string;
}

export class SupportPlatformAuthService {
    async getPublicKey() {
        try {
            logger.info("Fetching support platform public key");
            const response = await axios.get<GetPublicKeyResponseDTO>(
                `${EnvConfig.SUPPORT_PLATFORM_URL}/auth/public-key`
            );

            return response.data.publicKey;
        } catch (error: unknown) {
            logger.error("Error fetching support platform public key:", {
                error,
            });
            throw new AppError(
                "Error fetching support platform public key: " +
                    (error as Error).message,
                502
            );
        }
    }
}
