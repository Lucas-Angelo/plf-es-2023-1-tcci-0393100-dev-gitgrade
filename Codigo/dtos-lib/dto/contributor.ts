import { PaginationRequestDTO } from "../utils/pagination";

export interface ContributorDTO {
    id: number,
    githubName: string | null,
    githubEmail: string | null,
    githubLogin: string | null,
    githubAvatarUrl: string | null,
}

export interface GetAllContributorQueryDTO extends PaginationRequestDTO { }