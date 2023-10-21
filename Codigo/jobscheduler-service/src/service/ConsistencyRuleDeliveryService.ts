import moment from "moment";
import "moment-timezone";
import EnvConfig from "../config/EnvConfig";
import logger from "../config/LogConfig";
import { Repository } from "../model//Repository";
import { ConsistencyRule, ValidationType } from "../model/ConsistencyRule";
import {
    ConsistencyRuleDelivery,
    ConsistencyRuleDeliveryStatus,
    IConsistencyRuleDeliveryAttributes,
} from "../model/ConsistencyRuleDelivery";
import { Sprint } from "../model/Sprint";
import validateCitationFile from "../util/validator/CffValidator";
import { SprintService } from "./SprintService";
import { StandardizedIssueService } from "./StandardizedIssueService";
import {
    GitHubFileService,
    IGitHubFileStatus,
} from "./client/GitHubFileService";
import { GitHubIssueService } from "./client/GitHubIssueService";

class ConsistencyRuleDeliveryService {
    private sprintService: SprintService;
    private standardizationIssueService: StandardizedIssueService;

    private gitHubFileService: GitHubFileService;
    private gitHubIssueService: GitHubIssueService;

    constructor() {
        this.sprintService = new SprintService();
        this.standardizationIssueService = new StandardizedIssueService();

        this.gitHubFileService = new GitHubFileService();
        this.gitHubIssueService = new GitHubIssueService();
    }

    async createOrUpdate(
        repository: Repository,
        consistencyRule: ConsistencyRule,
        gitHubFileStatus: IGitHubFileStatus
    ) {
        try {
            const sprint = await this.findSprint(consistencyRule);

            const currentTime = new Date();
            const isOnTimeToDelivery: boolean = this.isOnTimeToDelivery(
                currentTime,
                sprint
            );

            const status = this.defineDeliveryStatus(
                gitHubFileStatus,
                isOnTimeToDelivery
            );
            const deliveryAt = this.defineDeliveryAtByStatus(
                status,
                gitHubFileStatus.deliveryDate
            );

            const consistencyRuleDeliveryData: IConsistencyRuleDeliveryAttributes =
                {
                    consistencyRuleId: consistencyRule.id,
                    repositoryId: repository.id,
                    deliveryAt: deliveryAt,
                    status: status,
                };

            const persistedConsistencyRuleDelivery =
                await this.findOneConsistencyRuleDeliveryByFields({
                    repositoryId: repository.id,
                    consistencyRuleId: consistencyRule.id,
                    status: status,
                });

            if (!persistedConsistencyRuleDelivery)
                await ConsistencyRuleDelivery.create(
                    consistencyRuleDeliveryData
                );
            else
                await ConsistencyRuleDelivery.update(
                    consistencyRuleDeliveryData,
                    {
                        where: {
                            id: persistedConsistencyRuleDelivery.id,
                        },
                    }
                );

            const isNeedOpenIssueForNotDeliveredConsistencyRule =
                this.isNeededOpenIssueForNotDeliveredConsistencyRule(
                    status,
                    isOnTimeToDelivery,
                    persistedConsistencyRuleDelivery,
                    consistencyRule
                );
            if (isNeedOpenIssueForNotDeliveredConsistencyRule) {
                await this.openIssueForNotDeliveredConsistencyRule(
                    repository,
                    consistencyRule,
                    sprint
                );
            }

            const isNeededCreateOrUpdateDeliveryWithInvalidity =
                this.isNeededCreateOrUpdateDeliveryWithInvalidityByStatus(
                    status
                );
            if (isNeededCreateOrUpdateDeliveryWithInvalidity)
                await this.createOrUpdateDeliveryWithInvalidity(
                    repository,
                    consistencyRule,
                    deliveryAt
                );
        } catch (error) {
            throw error;
        }
    }

    private async findSprint(
        consistencyRule: ConsistencyRule
    ): Promise<Sprint> {
        try {
            const sprint = await this.sprintService.findOneByFields({
                id: consistencyRule.sprintId,
            });

            if (!sprint) {
                logger.error("Sprint not found for consistency rule: ", {
                    consistencyRule,
                });
                throw new Error("Sprint not found for consistency rule.");
            }

            return sprint;
        } catch (error) {
            logger.error("Error fetching sprint:", {
                error,
            });
            throw error;
        }
    }

    isOnTimeToDelivery(currentTime: Date, sprint: Sprint): boolean {
        const isOnTimeToDelivery: boolean = currentTime <= sprint.end_date;
        return isOnTimeToDelivery;
    }

    defineDeliveryStatus(
        gitHubFileStatus: IGitHubFileStatus,
        isOnTimeToDelivery: boolean
    ): ConsistencyRuleDeliveryStatus {
        let status: ConsistencyRuleDeliveryStatus;
        if (gitHubFileStatus.status === "not_exists" && isOnTimeToDelivery) {
            status = ConsistencyRuleDeliveryStatus.AWAITING_DELIVERY;
        } else if (gitHubFileStatus.status === "exists" && isOnTimeToDelivery) {
            status = ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME;
        } else if (
            gitHubFileStatus.status === "exists" &&
            !isOnTimeToDelivery
        ) {
            status = ConsistencyRuleDeliveryStatus.DELIVERED_LATE;
        } else if (
            gitHubFileStatus.status === "not_exists" &&
            !isOnTimeToDelivery
        ) {
            status = ConsistencyRuleDeliveryStatus.NOT_DELIVERED;
        } else {
            logger.error("Invalid status for consistency rule delivery:", {
                gitHubFileStatus,
                isOnTimeToDelivery,
            });
            throw new Error("Invalid status for consistency rule delivery.");
        }

        return status;
    }

    private defineDeliveryAtByStatus(
        status: ConsistencyRuleDeliveryStatus,
        deliveryAt: Date | null
    ): Date | null {
        if (
            status === ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME ||
            status === ConsistencyRuleDeliveryStatus.DELIVERED_LATE
        ) {
            return deliveryAt;
        } else {
            return null;
        }
    }

    isNeededCreateOrUpdateDeliveryWithInvalidityByStatus(
        status: ConsistencyRuleDeliveryStatus
    ): boolean {
        if (
            status === ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME ||
            status === ConsistencyRuleDeliveryStatus.DELIVERED_LATE
        ) {
            return true;
        }
        return false;
    }

    async findOneConsistencyRuleDeliveryByFields(
        fields: Partial<IConsistencyRuleDeliveryAttributes>
    ): Promise<ConsistencyRuleDelivery | null> {
        logger.info("Finding consistency rule delivery by fields:", {
            fields,
        });
        try {
            const consistencyRuleDelivery =
                await ConsistencyRuleDelivery.findOne({
                    where: fields,
                });

            logger.info("Consistency rule delivery found:", {
                consistencyRuleDelivery,
            });

            return consistencyRuleDelivery;
        } catch (error) {
            logger.error("Error fetching consistency rule delivery:", {
                error,
            });
            throw error;
        }
    }

    isNeededOpenIssueForNotDeliveredConsistencyRule(
        status: ConsistencyRuleDeliveryStatus,
        isOnTimeToDelivery: boolean,
        persistedConsistencyRuleDelivery: ConsistencyRuleDelivery | null,
        consistencyRule: ConsistencyRule
    ) {
        if (
            !persistedConsistencyRuleDelivery &&
            status === ConsistencyRuleDeliveryStatus.NOT_DELIVERED &&
            !isOnTimeToDelivery &&
            consistencyRule.standardizedIssueId
        )
            return true;
        else return false;
    }

    private async openIssueForNotDeliveredConsistencyRule(
        repository: Repository,
        consistencyRule: ConsistencyRule,
        sprint: Sprint
    ) {
        const standardizedIssue =
            await this.standardizationIssueService.findOneByFields({
                id: consistencyRule.standardizedIssueId!,
            });
        if (standardizedIssue) {
            const formattedEndDate = moment
                .tz(sprint.end_date, EnvConfig.APP_TIMEZONE!)
                .format("DD/MM/YYYY HH:mm");

            const issueDescription: string =
                "O arquivo " +
                consistencyRule.filePath +
                " não foi entregue até a data limite " +
                formattedEndDate +
                " da sprint " +
                sprint.name +
                ".\n\n" +
                standardizedIssue.description;
            await this.gitHubIssueService.createIssue(
                repository.name,
                standardizedIssue!.title,
                issueDescription
            );
        } else
            logger.error("Standardized issue not found for consistency rule:", {
                consistencyRule,
            });
    }

    async createOrUpdateDeliveryWithInvalidity(
        repository: Repository,
        consistencyRule: ConsistencyRule,
        deliveryAt: Date | null
    ) {
        if (consistencyRule.validationType === ValidationType.CFF) {
            await this.createOrUpdateForCFFValidationType(
                repository,
                consistencyRule,
                deliveryAt
            );
        }
    }

    private async createOrUpdateForCFFValidationType(
        repository: Repository,
        consistencyRule: ConsistencyRule,
        deliveryAt: Date | null
    ) {
        const fileContent = await this.gitHubFileService.getFileContent(
            repository.name,
            consistencyRule.filePath,
            repository.defaultBranch
        );
        const isValidCitationFile: boolean = validateCitationFile(fileContent);

        logger.info("Citation file validation:", {
            repositoryName: repository.name,
            filePath: consistencyRule.filePath,
            valid: isValidCitationFile,
        });

        const status = ConsistencyRuleDeliveryStatus.DELIVERED_WITH_INVALIDITY;
        const consistencyRuleDeliveryData: IConsistencyRuleDeliveryAttributes =
            {
                consistencyRuleId: consistencyRule.id,
                repositoryId: repository.id,
                deliveryAt: deliveryAt,
                status: status,
            };

        const persistedConsistencyRuleDelivery =
            await this.findOneConsistencyRuleDeliveryByFields({
                repositoryId: repository.id,
                consistencyRuleId: consistencyRule.id,
                status: status,
            });

        if (!isValidCitationFile) {
            if (!persistedConsistencyRuleDelivery) {
                await ConsistencyRuleDelivery.create(
                    consistencyRuleDeliveryData
                );
            } else
                await ConsistencyRuleDelivery.update(
                    consistencyRuleDeliveryData,
                    {
                        where: {
                            id: persistedConsistencyRuleDelivery.id,
                        },
                    }
                );
        }

        const isNeededOpenIssueForDeliveredWithInvalidityConsistencyRule =
            this.isNeededOpenIssueForDeliveredWithInvalidityConsistencyRule(
                consistencyRule,
                persistedConsistencyRuleDelivery,
                isValidCitationFile
            );
        if (isNeededOpenIssueForDeliveredWithInvalidityConsistencyRule) {
            await this.openIssueForDeliveredWithInvalidityConsistencyRule(
                consistencyRule,
                repository
            );
        }
    }

    isNeededOpenIssueForDeliveredWithInvalidityConsistencyRule(
        consistencyRule: ConsistencyRule,
        persistedConsistencyRuleDelivery: ConsistencyRuleDelivery | null,
        isValidCitationFile: boolean
    ) {
        if (
            !persistedConsistencyRuleDelivery &&
            consistencyRule.standardizedIssueId &&
            !isValidCitationFile
        )
            return true;
        else return false;
    }

    private async openIssueForDeliveredWithInvalidityConsistencyRule(
        consistencyRule: ConsistencyRule,
        repository: Repository
    ) {
        const standardizedIssue =
            await this.standardizationIssueService.findOneByFields({
                id: consistencyRule.standardizedIssueId!,
            });
        if (standardizedIssue) {
            const issueDescription: string =
                "O arquivo " +
                consistencyRule.filePath +
                " foi entregue com inconsistências \n\n" +
                standardizedIssue.description;
            await this.gitHubIssueService.createIssue(
                repository.name,
                standardizedIssue!.title,
                issueDescription
            );
        } else
            logger.error("Standardized issue not found for consistency rule:", {
                consistencyRule,
            });
    }
}

export { ConsistencyRuleDeliveryService };
