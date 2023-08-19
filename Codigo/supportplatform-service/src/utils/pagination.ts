export function sequelizePagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const limitAndOffset = {
        limit,
        offset,
    };
    return limitAndOffset;
}
