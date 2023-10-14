import { PaginationRequestDTO } from "../utils/pagination";

export interface BranchDTO {
    id: number,
    name: string
}

export interface GetAllBranchQueryDTO extends PaginationRequestDTO { }