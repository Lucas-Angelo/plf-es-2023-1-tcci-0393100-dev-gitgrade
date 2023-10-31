import axios from "axios";
import EnvConfig from "../../config/EnvConfig";
import logger from "../../config/LogConfig";
import AppError from "../../error/AppError";

export class JobSchedulerSyncService {
    async sync(repositoryIdList: number[], bearerToken: string) {
        try {
            const searchParams = new URLSearchParams();
            repositoryIdList.forEach((repositoryId) => {
                searchParams.append("repositoryId", repositoryId.toString());
            });

            const requestUrl = `${
                EnvConfig.JOB_SCHEDULER_API_URL
            }/sync?${searchParams.toString()}`;
            const headers = {
                authorization: bearerToken,
            };

            logger.info("Fetching JobScheduler API to sync repositories", {
                requestUrl,
                headers,
            });
            return axios.patch<{
                success: boolean;
            }>(requestUrl, null, {
                headers,
            });
        } catch (error) {
            logger.error("Error while syncing", { error });
            throw new AppError("Error while syncing", 502, error);
        }
    }
}
