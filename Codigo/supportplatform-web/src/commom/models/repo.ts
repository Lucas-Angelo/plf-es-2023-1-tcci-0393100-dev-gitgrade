export interface IGetAllRepoRequest {
    page?: number | null;
    filter?: string | null;
}

export interface IGetAllRepoResponse {
    totalPages: number;
    results: Array<{
        name: string;
        evaluationMethodName: string;
        id: number;
    }>;
}
