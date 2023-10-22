import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getEvaluationMethodByIdQuery } from "../evaluationMethod";
import { SprintService } from "../../service/api/sprint";
import { SprintResponseDTO, SprintSearchDTO } from "@gitgrade/dtos";

export const getEvaluationMethodSprintQuery = (
    evaluationMethodId: number,
    filterOptions?: Omit<SprintSearchDTO, "evaluationMethodId">
) => {
    const baseKey = getEvaluationMethodByIdQuery(evaluationMethodId).queryKey;
    return {
        queryKey: filterOptions
            ? [...baseKey, "sprint", filterOptions]
            : [...baseKey, "sprint"],
        queryFn: async () =>
            new SprintService()
                .getAll({ ...filterOptions, evaluationMethodId })
                .then((res) => res.data),
        staleTime: Number.MAX_VALUE,
    };
};

export const useEvaluationMethodSprintList = (
    evaluationMethodId: number,
    filterOptions?: SprintSearchDTO,
    enabled?: boolean
) =>
    useQuery({
        ...getEvaluationMethodSprintQuery(evaluationMethodId, filterOptions),
        enabled,
    });

export const getEvaluationMethodSprintByIdQuery = (
    evaluationMethodId: number,
    id: number
) => {
    const baseKey = getEvaluationMethodByIdQuery(evaluationMethodId).queryKey;
    return {
        queryKey: [...baseKey, "sprint", id] as const,
        queryFn: async () =>
            new SprintService().getById(id).then((res) => {
                if (res.data.evaluationMethodId != evaluationMethodId) {
                    throw new Error("Sprint not found");
                }
                return res.data;
            }),
        staleTime: Number.MAX_VALUE,
    };
};

export const useEvaluationMethodSprintById = (
    evaluationMethodId: number,
    id: number,
    options?: Omit<
        UseQueryOptions<SprintResponseDTO>,
        "queryKey" | "queryFn" | "staleTime"
    >
) => {
    const query = getEvaluationMethodSprintByIdQuery(evaluationMethodId, id);
    const finalOptions: Omit<
        UseQueryOptions<SprintResponseDTO>,
        "queryKey" | "queryFn"
    > = {
        ...options,
        staleTime: query.staleTime,
    };
    return useQuery<SprintResponseDTO>(
        query.queryKey,
        query.queryFn,
        finalOptions
    );
};
