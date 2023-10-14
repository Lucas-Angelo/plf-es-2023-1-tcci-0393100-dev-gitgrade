export function sequelizePagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const limitAndOffset = {
        limit,
        offset,
    };
    return limitAndOffset;
}

export function getTotalPages(totalResults: number, limit: number) {
    return Math.ceil(totalResults / limit) || 1;
}
