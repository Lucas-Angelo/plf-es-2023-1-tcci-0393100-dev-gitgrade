import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getEvaluationMethodByIdQuery } from "../evaluationMethod";
import { ConsistencyRuleService } from "../../service/api/consistencyRule";
import {
    ConsistencyRuleResponseDTO,
    ConsistencyRuleSearchDTO,
} from "@gitgrade/dtos";

export const getEvaluationMethodConsistencyRuleQuery = (
    evaluationMethodId: number,
    filterOptions?: Omit<ConsistencyRuleSearchDTO, "evaluationMethodId">
) => {
    const baseKey = getEvaluationMethodByIdQuery(evaluationMethodId).queryKey;
    return {
        queryKey: filterOptions
            ? [...baseKey, "consistencyRule", filterOptions]
            : [...baseKey, "consistencyRule"],
        queryFn: async () =>
            new ConsistencyRuleService()
                .getAll({ ...filterOptions, evaluationMethodId })
                .then((res) => res.data),
        staleTime: Number.MAX_VALUE,
    };
};

export const useEvaluationMethodConsistencyRuleList = (
    evaluationMethodId: number,
    filterOptions?: ConsistencyRuleSearchDTO
) =>
    useQuery(
        getEvaluationMethodConsistencyRuleQuery(
            evaluationMethodId,
            filterOptions
        )
    );

export const getEvaluationMethodConsistencyRuleByIdQuery = (
    evaluationMethodId: number,
    id: number
) => {
    const baseKey = getEvaluationMethodByIdQuery(evaluationMethodId).queryKey;
    return {
        queryKey: [...baseKey, "consistencyRule", id] as const,
        queryFn: async () =>
            new ConsistencyRuleService().getById(id).then((res) => {
                if (res.data.evaluationMethodId != evaluationMethodId) {
                    throw new Error("ConsistencyRule not found");
                }
                return res.data;
            }),
        staleTime: Number.MAX_VALUE,
    };
};

export const useEvaluationMethodConsistencyRuleById = (
    evaluationMethodId: number,
    id: number,
    options?: Omit<
        UseQueryOptions<ConsistencyRuleResponseDTO>,
        "queryKey" | "queryFn" | "staleTime"
    >
) => {
    const query = getEvaluationMethodConsistencyRuleByIdQuery(
        evaluationMethodId,
        id
    );
    const finalOptions: Omit<
        UseQueryOptions<ConsistencyRuleResponseDTO>,
        "queryKey" | "queryFn"
    > = {
        ...options,
        staleTime: query.staleTime,
    };
    return useQuery<ConsistencyRuleResponseDTO>(
        query.queryKey,
        query.queryFn,
        finalOptions
    );
};
