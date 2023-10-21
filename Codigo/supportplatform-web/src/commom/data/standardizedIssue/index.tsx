import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getEvaluationMethodByIdQuery } from "../evaluationMethod";
import { StandardizedIssueService } from "../../service/api/standardizedIssue";
import {
    StandardizedIssueResponseDTO,
    StandardizedIssueSearchDTO,
} from "@gitgrade/dtos";

export const getEvaluationMethodStandardizedIssueQuery = (
    evaluationMethodId: number,
    filterOptions?: Omit<StandardizedIssueSearchDTO, "evaluationMethodId">
) => {
    const baseKey = getEvaluationMethodByIdQuery(evaluationMethodId).queryKey;
    return {
        queryKey: filterOptions
            ? [...baseKey, "standardizedIssue", filterOptions]
            : [...baseKey, "standardizedIssue"],
        queryFn: async () =>
            new StandardizedIssueService()
                .getAll({ ...filterOptions, evaluationMethodId })
                .then((res) => res.data),
        staleTime: Number.MAX_VALUE,
    };
};

export const useEvaluationMethodStandardizedIssueList = (
    evaluationMethodId: number,
    filterOptions?: StandardizedIssueSearchDTO
) =>
    useQuery(
        getEvaluationMethodStandardizedIssueQuery(
            evaluationMethodId,
            filterOptions
        )
    );

export const getEvaluationMethodStandardizedIssueByIdQuery = (
    evaluationMethodId: number,
    id: number
) => {
    const baseKey = getEvaluationMethodByIdQuery(evaluationMethodId).queryKey;
    return {
        queryKey: [...baseKey, "standardizedIssue", id] as const,
        queryFn: async () =>
            new StandardizedIssueService().getById(id).then((res) => {
                if (
                    res.data.evaluationMethodId.toString() !==
                    evaluationMethodId.toString()
                ) {
                    throw new Error("Standardized Issue not found");
                }
                return res.data;
            }),
        staleTime: Number.MAX_VALUE,
    };
};

export const useEvaluationMethodStandardizedIssueById = (
    evaluationMethodId: number,
    id: number,
    options?: Omit<
        UseQueryOptions<StandardizedIssueResponseDTO>,
        "queryKey" | "queryFn" | "staleTime"
    >
) => {
    const query = getEvaluationMethodStandardizedIssueByIdQuery(
        evaluationMethodId,
        id
    );
    const finalOptions: Omit<
        UseQueryOptions<StandardizedIssueResponseDTO>,
        "queryKey" | "queryFn"
    > = {
        ...options,
        staleTime: query.staleTime,
    };
    return useQuery<StandardizedIssueResponseDTO>(
        query.queryKey,
        query.queryFn,
        finalOptions
    );
};
