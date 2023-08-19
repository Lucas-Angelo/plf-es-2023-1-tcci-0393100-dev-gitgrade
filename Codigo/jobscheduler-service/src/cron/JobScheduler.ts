import cron from "node-cron";
import EnvConfig from "../config/EnvConfig";
import logger from "../config/LogConfig";
import { JobExecutor } from "../job/JobExecutor";

class JobScheduler {
    private jobExecutor: JobExecutor;

    constructor() {
        this.jobExecutor = new JobExecutor();
    }

    // This function converts HH:MM format into a cron string
    private convertToCronTime(time: string): string {
        const [hour, minute] = time.split(":");
        return `${minute} ${hour} * * *`;
    }

    start() {
        const syncTime = EnvConfig.SYNC_TIME;
        if (!syncTime) {
            logger.error("SYNC_TIME environment variable is not set.");
            return;
        }

        const cronTime = this.convertToCronTime(syncTime);

        logger.info(
            `Scheduling JobExecutor to run every day at ${syncTime} (cron format: ${cronTime})`
        );

        cron.schedule(cronTime, async () => {
            try {
                logger.info("JobScheduler: Time to run the JobExecutor!");
                await this.jobExecutor.runFetchers();
            } catch (error) {
                logger.error("JobScheduler: Error executing the JobExecutor.", {
                    error,
                });
            }
        });
    }
}

export { JobScheduler };
