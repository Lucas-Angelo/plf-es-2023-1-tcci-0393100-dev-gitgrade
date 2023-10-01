/**
 * StandardizedIssueCreateDTO - Used for creating a new StandardizedIssue.
 */
export interface StandardizedIssueCreateDTO {
  /**
   * @isInt evaluationMethodId must be an integer
   * @minimum 1 evaluationMethodId must be greater than or equal to 1
   */
  evaluationMethodId: number;
  /**
   * @isString title must be a string
   * @minLength 1 title must have a minimum length of 1
   * @maxLength 255 title must have a maximum length of 255
   */
  title: string;
  /**
   * @isOptional description is optional
   * @isString description must be a string
   * @minLength 1 description must have a minimum length of 1
   */
  description?: string | null;
}

/**
 * StandardizedIssueUpdateDTO - Used for updating an existing StandardizedIssue.
 */
export interface StandardizedIssueUpdateDTO {
  /**
   * @isInt evaluationMethodId must be an integer
   * @minimum 1 evaluationMethodId must be greater than or equal to 1
   */
  evaluationMethodId: number;
  /**
   * @isString title must be a string
   * @minLength 1 title must have a minimum length of 1
   * @maxLength 255 title must have a maximum length of 255
   */
  title: string;
  /**
   * @isOptional description is optional
   * @isString description must be a string
   * @minLength 1 description must have a minimum length of 1
   */
  description?: string | null;
}

/**
 * StandardizedIssueSearchDTO - Used for searching through StandardizedIssues with pagination and filters.
 */
export interface StandardizedIssueSearchDTO {
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
   * @isOptional title is optional
   * @isString title must be a string
   * @minLength 1 title must have a minimum length of 1
   * @maxLength 255 title must have a maximum length of 255
   */
  title?: string;
  /**
   * @isOptional description is optional
   * @isString description must be a string
   * @minLength 1 description must have a minimum length of 1
   */
  description?: string;
}

/**
 * StandardizedIssueFindOneDTO - Used for finding a single StandardizedIssue.
 */
export interface StandardizedIssueFindOneDTO {
  /**
   * @isOptional id is optional
   * @isInt id must be an integer
   */
  id?: number;
  /**
   * @isOptional evaluationMethodId is optional
   * @isInt evaluationMethodId must be an integer
   */
  evaluationMethodId?: number;
  /**
   * @isOptional title is optional
   * @isString title must be a string
   */
  title?: string;
}

/**
 * StandardizedIssueResponseDTO - Could be used to structure the response object when sending StandardizedIssues to the client.
 */
export interface StandardizedIssueResponseDTO {
  id: number;
  evaluationMethodId: number;
  title: string;
  description?: string | null;
}
