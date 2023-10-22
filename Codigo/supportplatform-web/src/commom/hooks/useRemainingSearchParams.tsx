import { useSearchParams } from "react-router-dom";

export function useSearchParamsString(options?: { include?: string[] }) {
    const [searchParams] = useSearchParams();

    if (searchParams.size === 0) return "";

    const clonedSearchParams = new URLSearchParams(searchParams.toString());

    if (options?.include) {
        for (const key of clonedSearchParams.keys()) {
            if (!options.include.includes(key)) {
                clonedSearchParams.delete(key);
            }
        }
    }

    return `?${clonedSearchParams.toString()}`;
}
