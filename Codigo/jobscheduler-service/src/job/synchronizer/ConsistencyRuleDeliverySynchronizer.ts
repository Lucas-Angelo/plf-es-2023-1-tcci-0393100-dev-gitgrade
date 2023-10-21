import logger from "../../config/LogConfig";
import { ConsistencyRuleDeliveryService } from "../../service/ConsistencyRuleDeliveryService";
import { ConsistencyRuleService } from "../../service/ConsistencyRuleService";
import { RepositoryService } from "../../service/RepositoryService";
import {
    GitHubFileService,
    IGitHubFileStatus,
} from "../../service/client/GitHubFileService";
import FetchUtil from "../../util/FetchUtil";

class ConsistencyRuleDeliverySynchronizer {
    private repositoryService: RepositoryService;
    private consistencyRuleService: ConsistencyRuleService;
    private consistencyRuleDeliveryService: ConsistencyRuleDeliveryService;

    private gitHubFileService: GitHubFileService;

    private fetchUtil: FetchUtil;

    constructor() {
        this.repositoryService = new RepositoryService();
        this.consistencyRuleService = new ConsistencyRuleService();
        this.consistencyRuleDeliveryService =
            new ConsistencyRuleDeliveryService();

        this.gitHubFileService = new GitHubFileService();

        this.fetchUtil = new FetchUtil();
    }

    async syncConsistencyRuleDeliveriesAndStdIssues() {
        try {
            const repositoriesWithEvaluationMethod =
                await this.repositoryService.findAllRepositoriesWithEvaluationMethod();

            for (const repository of repositoriesWithEvaluationMethod) {
                const consistencyRulesWithSprintAndStdIssue =
                    await this.consistencyRuleService.findAllConsistencyRulesByFields(
                        { evaluationMethodId: repository!.evaluationMethod!.id }
                    );

                for (const consistencyRule of consistencyRulesWithSprintAndStdIssue) {
                    const gitHubFileStatus =
                        await this.fetchGitHubFileCreationDateWithRetry(
                            repository.name,
                            consistencyRule.filePath,
                            repository.defaultBranch
                        );
                    logger.info(`File "${consistencyRule.filePath}`, {
                        gitHubFileStatus,
                    });
                    await this.consistencyRuleDeliveryService.createOrUpdate(
                        repository,
                        consistencyRule,
                        gitHubFileStatus
                    );
                }
            }
        } catch (error) {
            logger.error("Error fetching ConsistencyRuleDeliveryes", error);
            throw error;
        }
    }

    private async fetchGitHubFileCreationDateWithRetry(
        repositoryName: string,
        filePath: string,
        branch: string
    ): Promise<IGitHubFileStatus> {
        return await this.fetchUtil.retry<IGitHubFileStatus>(async () => {
            return await this.gitHubFileService.getFileCreationDate(
                repositoryName,
                filePath,
                branch
            );
        }, `Error fetching file "${filePath}" creation date for repository "${repositoryName}"`);
    }
}

export { ConsistencyRuleDeliverySynchronizer };
