import { PaginationRequestDTO } from "../utils/pagination";

export interface BranchDTO {
  id: number;
  name: string;
  commitAutomaticSynchronization: boolean;
  fileAutomaticSynchronization: boolean;
  repositoryId: number;
}

export interface BranchPatchDTO {
  commitAutomaticSynchronization?: boolean;
  fileAutomaticSynchronization?: boolean;
}

export interface GetAllBranchQueryDTO extends PaginationRequestDTO {}
