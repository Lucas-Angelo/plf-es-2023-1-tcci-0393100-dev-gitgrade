import { ConsistencyRule } from "../../model/ConsistencyRule";
import {
    ConsistencyRuleDelivery,
    ConsistencyRuleDeliveryStatus,
} from "../../model/ConsistencyRuleDelivery";
import { Sprint } from "../../model/Sprint";
import { ConsistencyRuleDeliveryService } from "../../service/ConsistencyRuleDeliveryService";
import { IGitHubFileStatus } from "../../service/client/GitHubFileService";

describe("isNeededCreateOrUpdateDeliveryWithInvalidityByStatus", () => {
    let consistencyRuleDeliveryService: ConsistencyRuleDeliveryService;

    beforeEach(() => {
        consistencyRuleDeliveryService = new ConsistencyRuleDeliveryService();
    });

    const testCases = [];

    const possibleStatus = [
        ConsistencyRuleDeliveryStatus.AWAITING_DELIVERY,
        ConsistencyRuleDeliveryStatus.DELIVERED_LATE,
        ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME,
        ConsistencyRuleDeliveryStatus.DELIVERED_WITH_INVALIDITY,
        ConsistencyRuleDeliveryStatus.NOT_DELIVERED,
    ];

    for (const status of possibleStatus) {
        if (
            status === ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME ||
            status === ConsistencyRuleDeliveryStatus.DELIVERED_LATE
        ) {
            testCases.push({
                status,
                expectedResult: true,
            });
        } else {
            testCases.push({
                status,
                expectedResult: false,
            });
        }
    }

    testCases.forEach(({ status, expectedResult }, index) => {
        it(`should return ${expectedResult} for status ${status} - Test Case ${
            index + 1
        }`, () => {
            const result =
                consistencyRuleDeliveryService.isNeededCreateOrUpdateDeliveryWithInvalidityByStatus(
                    status
                );
            expect(result).toBe(expectedResult);
        });
    });
});

describe("isNeededOpenIssueForNotDeliveredConsistencyRule", () => {
    let consistencyRuleDeliveryService: ConsistencyRuleDeliveryService;

    beforeEach(() => {
        consistencyRuleDeliveryService = new ConsistencyRuleDeliveryService();
    });

    const testCases = [];

    const persistedConsistencyRuleDeliveries = [true, false];
    const possibleStatus = [
        ConsistencyRuleDeliveryStatus.AWAITING_DELIVERY,
        ConsistencyRuleDeliveryStatus.DELIVERED_LATE,
        ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME,
        ConsistencyRuleDeliveryStatus.DELIVERED_WITH_INVALIDITY,
        ConsistencyRuleDeliveryStatus.NOT_DELIVERED,
    ];
    const standardizedIssueIds = [null, 1, 2];

    for (const persistedConsistencyRuleDelivery of persistedConsistencyRuleDeliveries) {
        for (const status of possibleStatus) {
            for (const standardizedIssueId of standardizedIssueIds) {
                // Skip the expectedTrue case you already handled manually
                if (
                    !persistedConsistencyRuleDelivery &&
                    status === ConsistencyRuleDeliveryStatus.NOT_DELIVERED &&
                    standardizedIssueId
                ) {
                    testCases.push({
                        persistedConsistencyRuleDelivery,
                        status,
                        consistencyRule: {
                            standardizedIssueId,
                        },
                        expectedResult: true,
                    });
                } else {
                    testCases.push({
                        persistedConsistencyRuleDelivery,
                        status,
                        consistencyRule: {
                            standardizedIssueId,
                        },
                        expectedResult: false,
                    });
                }
            }
        }
    }

    testCases.forEach(
        (
            {
                status,
                persistedConsistencyRuleDelivery,
                consistencyRule,
                expectedResult,
            },
            index
        ) => {
            it(`should return ${expectedResult} for status ${status} - Test Case ${
                index + 1
            }`, () => {
                const result =
                    consistencyRuleDeliveryService.isNeededOpenIssueForNotDeliveredConsistencyRule(
                        status,
                        persistedConsistencyRuleDelivery as unknown as ConsistencyRuleDelivery,
                        consistencyRule as unknown as ConsistencyRule
                    );
                expect(result).toBe(expectedResult);
            });
        }
    );

    const testCasesSet = new Set();

    const duplicatedTestCases: number[] = [];
    testCases.forEach((testCase, index) => {
        const representation = `${testCase.persistedConsistencyRuleDelivery}-${testCase.status}-${testCase.consistencyRule.standardizedIssueId}`;
        if (testCasesSet.has(representation)) {
            duplicatedTestCases.push(index + 1);
        } else {
            testCasesSet.add(representation);
        }
    });

    console.log(duplicatedTestCases);
});

describe("isNeededOpenIssueForDeliveredWithInvalidityConsistencyRule", () => {
    let consistencyRuleDeliveryService: ConsistencyRuleDeliveryService;

    beforeEach(() => {
        consistencyRuleDeliveryService = new ConsistencyRuleDeliveryService();
    });

    const testCases = [];

    const persistedConsistencyRuleDeliveries = [true, false];
    const isValidCitationFiles = [true, false];
    const standardizedIssueIds = [null, 1, 2];

    for (const persistedConsistencyRuleDelivery of persistedConsistencyRuleDeliveries) {
        for (const isValidCitationFile of isValidCitationFiles) {
            for (const standardizedIssueId of standardizedIssueIds) {
                if (
                    !persistedConsistencyRuleDelivery &&
                    standardizedIssueId &&
                    !isValidCitationFile
                ) {
                    testCases.push({
                        persistedConsistencyRuleDelivery,
                        isValidCitationFile,
                        consistencyRule: {
                            standardizedIssueId,
                        },
                        expectedResult: true,
                    });
                } else {
                    testCases.push({
                        persistedConsistencyRuleDelivery,
                        isValidCitationFile,
                        consistencyRule: {
                            standardizedIssueId,
                        },
                        expectedResult: false,
                    });
                }
            }
        }
    }

    testCases.forEach(
        (
            {
                persistedConsistencyRuleDelivery,
                isValidCitationFile,
                consistencyRule,
                expectedResult,
            },
            index
        ) => {
            it(`should return ${expectedResult} for status ${isValidCitationFile} - Test Case ${
                index + 1
            }`, () => {
                const result =
                    consistencyRuleDeliveryService.isNeededOpenIssueForDeliveredWithInvalidityConsistencyRule(
                        consistencyRule as unknown as ConsistencyRule,
                        persistedConsistencyRuleDelivery as unknown as ConsistencyRuleDelivery,
                        isValidCitationFile
                    );
                expect(result).toBe(expectedResult);
            });
        }
    );
});

describe("isOnTimeToDelivery", () => {
    let consistencyRuleDeliveryService: ConsistencyRuleDeliveryService;

    beforeEach(() => {
        consistencyRuleDeliveryService = new ConsistencyRuleDeliveryService();
    });

    const testCases = [];

    const sprintEndDates = [
        new Date("2021-05-01"),
        new Date("2022-05-01"),
        new Date("2023-05-01"),
        new Date("2023-05-02"),
        new Date("2023-05-03"),
        new Date("2023-05-04"),
        new Date("2023-05-05"),
        new Date("2021-05-01 10:00:00"),
        new Date("2022-05-01 11:30:00"),
        new Date("2023-05-01 09:00:00"),
        new Date("2023-05-01 12:00:00"),
        new Date("2023-05-02 14:45:00"),
        new Date("2023-05-03 16:30:00"),
        new Date("2023-05-04 08:15:00"),
    ];

    const currentTime = new Date("2023-05-01");

    for (const sprintEndDate of sprintEndDates) {
        if (currentTime.getTime() === sprintEndDate.getTime()) {
            testCases.push({
                sprintEndDate,
                expectedResult: true,
            });
        } else if (currentTime.getTime() < sprintEndDate.getTime()) {
            testCases.push({
                sprintEndDate,
                expectedResult: true,
            });
        } else {
            testCases.push({
                sprintEndDate,
                expectedResult: false,
            });
        }
    }

    testCases.forEach(({ sprintEndDate, expectedResult }, index) => {
        it(`should return ${expectedResult} for sprintEndDate ${sprintEndDate} - Test Case ${
            index + 1
        }`, () => {
            const sprint = {
                end_date: sprintEndDate,
            } as unknown as Sprint;
            const result = consistencyRuleDeliveryService.isOnTimeToDelivery(
                currentTime,
                sprint
            );
            expect(result).toBe(expectedResult);
        });
    });
});

describe("defineDeliveryStatus", () => {
    let consistencyRuleDeliveryService: ConsistencyRuleDeliveryService;

    beforeEach(() => {
        consistencyRuleDeliveryService = new ConsistencyRuleDeliveryService();
    });

    const testCases = [];

    const gitHubFileStatuses = [
        {
            status: "not_exists",
            isOnTimeToDelivery: true,
            deliveredOnTime: false,
            expectedResult: ConsistencyRuleDeliveryStatus.AWAITING_DELIVERY,
        },
        {
            status: "exists",
            isOnTimeToDelivery: true,
            deliveredOnTime: true,
            expectedResult: ConsistencyRuleDeliveryStatus.DELIVERED_ON_TIME,
        },
        {
            status: "exists",
            isOnTimeToDelivery: false,
            deliveredOnTime: false,
            expectedResult: ConsistencyRuleDeliveryStatus.DELIVERED_LATE,
        },
        {
            status: "not_exists",
            isOnTimeToDelivery: false,
            deliveredOnTime: false,
            expectedResult: ConsistencyRuleDeliveryStatus.NOT_DELIVERED,
        },
    ];

    for (const gitHubFileStatus of gitHubFileStatuses) {
        testCases.push({
            gitHubFileStatus,
            expectedResult: gitHubFileStatus.expectedResult,
        });
    }

    testCases.forEach(({ gitHubFileStatus, expectedResult }, index) => {
        it(`should return ${expectedResult} for status ${
            gitHubFileStatus.status
        } - Test Case ${index + 1}`, () => {
            const result = consistencyRuleDeliveryService.defineDeliveryStatus(
                gitHubFileStatus as unknown as IGitHubFileStatus,
                gitHubFileStatus.isOnTimeToDelivery,
                gitHubFileStatus.deliveredOnTime
            );
            expect(result).toBe(expectedResult);
        });
    });
});
