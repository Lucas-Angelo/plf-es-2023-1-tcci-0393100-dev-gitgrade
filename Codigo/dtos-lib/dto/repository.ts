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
  /**
   * @isInt evaluationMethodId must be an integer
   * @minimum 1 evaluationMethodId must be greater than or equal to 1
   */
  evaluationMethodId?: number;
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
