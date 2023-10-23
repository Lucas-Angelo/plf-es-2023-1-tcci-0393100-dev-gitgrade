import { PaginationRequestDTO } from "../utils/pagination";
import { ContributorDTO } from "./contributor";

/**
 * FileSearchDTO - Used for searching through Files with pagination and filters.
 */
export interface FileSearchDTO extends PaginationRequestDTO {
  /**
   * @isString message must be a string
   * @minLength 1 message must have a minimum length of 1
   * @maxLength 255 message must have a maximum length of 255
   */
  path?: string;
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
  repositoryId: number;

  branchName?: string;
  /** @isArray contributor must be an array */
  contributor?: Array<string>;
  /** @isBool  filterWithNoContributor must be a boolean */
  filterWithNoContributor?: boolean;
}

/**
 * FileResponseDTO - Could be used to structure the response object when sending Files to the client.
 */
export interface FileResponseDTO {
  path: string;
  extension: string | null;
  additions: number;
  deletions: number;
  contributors?: Array<ContributorDTO | null>;
}
