import { PaginationRequestDTO } from "../utils/pagination";
import { BranchDTO } from "./branch";
import { ContributorDTO } from "./contributor";

/**
 * CommitSearchDTO - Used for searching through Commits with pagination and filters.
 */
export interface CommitSearchDTO extends PaginationRequestDTO {
  /**
   * @isString message must be a string
   * @minLength 1 message must have a minimum length of 1
   * @maxLength 255 message must have a maximum length of 255
   */
  message?: string;
  /**
   * @isDate startedAt must be a Date
   */
  startedAt?: Date;
  /**
   * @isDate endedAt must be a Date
   */
  endedAt?: Date;
  /**
   * @isInt repositoryId must be an integer
   * @minimum 1 repositoryId must be greater than or equal to 1
   */
  repositoryId?: number;

  branchName?: string;
  /** @isArray contributor must be an array */
  contributor?: Array<string>;
  /** @isBool  filterWithNoContributor must be a boolean */
  filterWithNoContributor?: boolean;
  /** @isBool  possiblyAffectedByForcePush must be a boolean */
  possiblyAffectedByForcePush?: boolean;
}

/**
 * CommitResponseDTO - Could be used to structure the response object when sending Commits to the client.
 */
export interface CommitResponseDTO {
  id: number;
  message: string | null;
  committedDate: Date;
  branch: BranchDTO;
  contributor?: ContributorDTO;
  sha: string;
  possiblyAffectedByForcePush: boolean;
}
