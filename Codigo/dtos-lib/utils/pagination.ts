export type PaginationResponseDTO<T> = {
    totalPages: number;
    results: T[];
}