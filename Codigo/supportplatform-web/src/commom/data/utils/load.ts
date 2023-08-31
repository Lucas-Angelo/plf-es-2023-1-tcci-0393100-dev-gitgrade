import { QueryKey, FetchQueryOptions } from "@tanstack/react-query";
import queryClient from "../client";
import { RequiredSome } from "../../types/utils";

export async function loadQueryData<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(
    query: RequiredSome<
        FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "queryKey" | "queryFn"
    >
): Promise<TData> {
    const queryState = queryClient.getQueryState<TData>(query.queryKey);
    if (!queryState?.data || !queryState?.isInvalidated) {
        return await queryClient.fetchQuery(query);
    } else return queryState.data;
}
