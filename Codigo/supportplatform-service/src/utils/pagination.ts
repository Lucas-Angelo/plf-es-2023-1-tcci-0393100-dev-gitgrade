export function sequelizePagination(page: number, limit: number) {
    const offset = page * limit;
    const limitAndOffset = {
        limit,
        offset
    }
    return limitAndOffset;
}