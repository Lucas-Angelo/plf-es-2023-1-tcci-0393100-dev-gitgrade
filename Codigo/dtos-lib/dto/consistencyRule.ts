export enum ValidationType {
  DEFAULT = "DEFAULT",
  CFF = "CFF",
}

/**
 * ConsistencyRuleCreateDTO - Used for creating a new ConsistencyRule.
 */
export interface ConsistencyRuleCreateDTO {
  /**
   * @isInt evaluationMethodId must be an integer
   * @minimum 1 evaluationMethodId must be greater than or equal to 1
   */
  evaluationMethodId: number;
  /**
   * @isInt sprintId must be an integer
   * @minimum 1 sprintId must be greater than or equal to 1
   */
  sprintId: number;
  /**
   * @isOptional standardizedIssueId is optional
   * @isInt standardizedIssueId must be an integer
   * @minimum 1 standardizedIssueId must be greater than or equal to 1
   */
  standardizedIssueId?: number | null;
  /**
   * @isOptional description is optional
   * @isString description must be a string
   * @minLength 1 description must have a minimum length of 1
   * @maxLength 255 description must have a maximum length of 255
   */
  description?: string | null;
  /**
   * @isString filePath must be a string
   * @minLength 1 filePath must have a minimum length of 1
   * @maxLength 10000 filePath must have a maximum length of 10000
   */
  filePath: string;
  /**
   * @isEnum validationType must be one of ['DEFAULT', 'CFF']
   */
  validationType: ValidationType;
}

/**
 * ConsistencyRuleUpdateDTO - Used for updating an existing ConsistencyRule.
 */
export interface ConsistencyRuleUpdateDTO {
  /**
   * @isInt evaluationMethodId must be an integer
   * @minimum 1 evaluationMethodId must be greater than or equal to 1
   */
  evaluationMethodId: number;
  /**
   * @isInt sprintId must be an integer
   * @minimum 1 sprintId must be greater than or equal to 1
   */
  sprintId: number;
  /**
   * @isOptional standardizedIssueId is optional
   * @isInt standardizedIssueId must be an integer
   * @minimum 1 standardizedIssueId must be greater than or equal to 1
   */
  standardizedIssueId?: number | null;
  /**
   * @isOptional description is optional
   * @isString description must be a string
   * @minLength 1 description must have a minimum length of 1
   * @maxLength 255 description must have a maximum length of 255
   */
  description?: string | null;
  /**
   * @isString filePath must be a string
   * @minLength 1 filePath must have a minimum length of 1
   * @maxLength 10000 filePath must have a maximum length of 10000
   */
  filePath: string;
  /**
   * @isEnum validationType must be one of ['DEFAULT', 'CFF']
   */
  validationType: ValidationType;
}

/**
 * ConsistencyRuleSearchDTO - Used for searching through ConsistencyRules with pagination and filters.
 */
export interface ConsistencyRuleSearchDTO {
  /**
   * @isOptional page is optional, if not provided, default to 1
   * @isInt page must be an integer
   * @minimum 1 page must be greater than or equal to 1
   * @default 1
   */
  page?: number;
  /**
   * @isOptional limit is optional, if not provided, default to 10
   * @isInt limit must be an integer
   * @minimum 1 limit must be greater than or equal to 1
   * @default 10
   */
  limit?: number;
  /**
   * @isOptional evaluationMethodId is optional
   * @isInt evaluationMethodId must be an integer
   * @minimum 1 evaluationMethodId must be greater than or equal to 1
   */
  evaluationMethodId?: number;
  /**
   * @isOptional sprintId is optional
   * @isInt sprintId must be an integer
   * @minimum 1 sprintId must be greater than or equal to 1
   */
  sprintId?: number;
  /**
   * @isOptional standardizedIssueId is optional
   * @isInt standardizedIssueId must be an integer
   * @minimum 1 standardizedIssueId must be greater than or equal to 1
   */
  standardizedIssueId?: number;
  /**
   * @isOptional description is optional
   * @isString description must be a string
   */
  description?: string;
  /**
   * @isOptional filePath is optional
   * @isString filePath must be a string
   */
  filePath?: string;
  /**
   * @isOptional validationType is optional
   * @isEnum validationType must be one of ['DEFAULT', 'CFF']
   */
  validationType?: ValidationType;
}

/**
 * ConsistencyRuleFindOneDTO - Used for finding a single ConsistencyRule.
 */
export interface ConsistencyRuleFindOneDTO {
  /**
   * @isOptional id is optional
   * @isInt id must be an integer
   * @minimum 1 id must be greater than or equal to 1
   */
  id?: number;
  /**
   * @isOptional evaluationMethodId is optional
   * @isInt evaluationMethodId must be an integer
   * @minimum 1 evaluationMethodId must be greater than or equal to 1
   */
  evaluationMethodId?: number;
  /**
   * @isOptional sprintId is optional
   * @isInt sprintId must be an integer
   * @minimum 1 sprintId must be greater than or equal to 1
   */
  sprintId?: number;
  /**
   * @isOptional standardizedIssueId is optional
   * @isInt standardizedIssueId must be an integer
   * @minimum 1 standardizedIssueId must be greater than or equal to 1
   */
  standardizedIssueId?: number;
  /**
   * @isOptional description is optional
   * @isString description must be a string
   */
  description?: string;
  /**
   * @isOptional filePath is optional
   * @isString filePath must be a string
   */
  filePath?: string;
  /**
   * @isOptional validationType is optional
   * @isEnum validationType must be one of ['DEFAULT', 'CFF']
   */
  validationType?: ValidationType;
}

/**
 * ConsistencyRuleResponseDTO - Could be used to structure the response object when sending ConsistencyRules to the client.
 */
export interface ConsistencyRuleResponseDTO {
  id: number;
  evaluationMethodId: number;
  sprintId: number;
  standardizedIssueId: number | null;
  description: string | null;
  filePath: string;
  validationType: ValidationType;
}
