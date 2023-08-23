import logger from "../config/LogConfig";
import TimeUtil from "./TimeUtil";

class FetchUtil {
    private readonly retryDelayMilliseconds: number = 5000;
    private readonly maxRetryAttempts: number = 3;

    async retry<T>(
        operation: () => Promise<T>,
        errorMessage: string
    ): Promise<T> {
        let retryAttempt = 0;
        let retrySuccessful = false;
        let result: T;

        while (retryAttempt < this.maxRetryAttempts && !retrySuccessful) {
            try {
                result = await operation();
                retrySuccessful = true;
            } catch (error) {
                logger.warn(
                    `[${errorMessage}] (Attempt ${retryAttempt + 1} of ${
                        this.maxRetryAttempts
                    }):`,
                    { error }
                );
                await TimeUtil.sleep(this.retryDelayMilliseconds);
                retryAttempt++;
            }
        }

        /*
         * ATTENTION: Dont throw error if retry failed,
         * because it will not be handled by the caller and will crash the application
         */
        if (!retrySuccessful)
            logger.error(`All retry attempts failed. ${errorMessage}`);

        return result!;
    }
}

export default FetchUtil;
