import { EvaluationMethodResponseDTO } from "./evaluationMethod";

export interface RepositoryDTO {
  id: number;
  evaluationMethod?: EvaluationMethodResponseDTO | null;
  githubId: string;
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  githubCreatedAt: Date;
  githubUpdatedAt: Date;
  hasProjectsEnabled: boolean;
  hasIssuesEnabled: boolean;
  primaryLanguage: string | null;
  licenseName: string | null;
  defaultBranch: string | null;
  automaticSynchronization: boolean;
  synchronizing: boolean;
  lastSyncAt: Date | null;
}

export interface GetAllRepositoryQueryDTO {
  /**
   * @isInt page must be an integer
   * @minimum 1 page must be greater than or equal to 1
   */
  page?: number;
  /**
   * @isInt limit must be an integer
   * @minimum 1 limit must be greater than or equal to 1
   */
  limit?: number;
  filter?: string;
}

/**
 * RepositoryPatchDTO - Used for updating a Repository.
 */
export interface RepositoryPatchDTO {
  /**
   * @isOptional evaluationMethodId is optional
   * @isInt evaluationMethodId must be an integer
   * @minimum 1 evaluationMethodId must be greater than or equal to 1
   */
  evaluationMethodId?: number | null;
  /**
   * @isOptional automaticSynchronization is optional
   * @isBool automaticSynchronization must be a boolean
   */
  automaticSynchronization?: boolean;
}

export interface RepositoryFindOneDTO {
  /**
   * @isInt id must be an integer
   * @isOptional id is optional
   */
  id?: number;
  /**
   * @isInt evaluationMethodId must be an integer
   * @minimum 1 evaluationMethodId must be greater than or equal to 1
   * @isOptional evaluationMethodId is optional
   */
  evaluationMethodId?: number;
  /**
   * @isString githubId must be a string
   * @minLength 1 githubId must have a minimum length of 1
   * @maxLength 255 githubId must have a maximum length of 255
   * @isOptional githubId is optional
   */
  githubId?: string;
  /**
   * @isString name must be a string
   * @minLength 1 name must have a minimum length of 1
   * @maxLength 255 name must have a maximum length of 255
   * @isOptional name is optional
   */
  name?: string;
  /**
   * @isString description must be a string
   * @minLength 1 description must have a minimum length of 1
   * @maxLength 255 description must have a maximum length of 255
   * @isOptional description is optional
   */
  description?: string;
  /**
   * @isInt stargazerCount must be an integer
   * @minimum 1 stargazerCount must be greater than or equal to 1
   * @isOptional stargazerCount is optional
   */
  stargazerCount?: number;
  /**
   * @isInt forkCount must be an integer
   * @minimum 1 forkCount must be greater than or equal to 1
   * @isOptional forkCount is optional
   */
  forkCount?: number;
  /**
   * @isDate githubCreatedAt must be a Date
   * @isOptional githubCreatedAt is optional
   */
  githubCreatedAt?: Date;
  /**
   * @isDate githubUpdatedAt must be a Date
   * @isOptional githubUpdatedAt is optional
   */
  githubUpdatedAt?: Date;
  /**
   * @isBool hasProjectsEnabled must be a boolean
   * @isOptional hasProjectsEnabled is optional
   */
  hasProjectsEnabled?: boolean;
  /**
   * @isBool hasIssuesEnabled must be a boolean
   * @isOptional hasIssuesEnabled is optional
   */
  hasIssuesEnabled?: boolean;
  /**
   * @isString primaryLanguage must be a string
   * @minLength 1 primaryLanguage must have a minimum length of 1
   * @maxLength 255 primaryLanguage must have a maximum length of 255
   * @isOptional primaryLanguage is optional
   */
  primaryLanguage?: string;
  /**
   * @isString licenseName must be a string
   * @minLength 1 licenseName must have a minimum length of 1
   * @maxLength 255 licenseName must have a maximum length of 255
   * @isOptional licenseName is optional
   */
  licenseName?: string;
  /**
   * @isString defaultBranch must be a string
   * @minLength 1 defaultBranch must have a minimum length of 1
   * @maxLength 255 defaultBranch must have a maximum length of 255
   * @isOptional defaultBranch is optional
   */
  defaultBranch?: string;
  /**
   * @isBool automaticSynchronization must be a boolean
   * @isOptional automaticSynchronization is optional
   */
  automaticSynchronization?: boolean;
  /**
   * @isBool synchronizing must be a boolean
   * @isOptional synchronizing is optional
   */
  synchronizing?: boolean;
  /**
   * @isDate lastSyncAt must be a Date
   * @isOptional lastSyncAt is optional
   */
  lastSyncAt?: Date;
}
