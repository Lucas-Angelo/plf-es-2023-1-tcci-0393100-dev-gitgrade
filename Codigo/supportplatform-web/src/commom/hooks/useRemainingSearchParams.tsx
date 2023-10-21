import { useSearchParams } from "react-router-dom";

export function useSearchParamsString() {
    const [searchParams] = useSearchParams();

    if (searchParams.size === 0) return "";

    return `?${searchParams.toString()}`;
}
