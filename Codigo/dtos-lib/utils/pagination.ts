export interface PaginationRequestDTO {
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
}

export type PaginationResponseDTO<T> = {
    totalPages: number;
    results: T[];
}