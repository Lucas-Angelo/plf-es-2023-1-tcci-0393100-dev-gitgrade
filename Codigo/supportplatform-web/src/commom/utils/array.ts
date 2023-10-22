export function groupBy<T, K>(
    array: T[],
    groupKeyGetter: (item: T) => K
): Map<K, T[]> {
    const result: Map<K, T[]> = new Map();
    array.forEach((item) => {
        const key = groupKeyGetter(item);
        if (!result.has(key)) {
            result.set(key, []);
        }
        result.get(key)!.push(item);
    });
    return result;
}
