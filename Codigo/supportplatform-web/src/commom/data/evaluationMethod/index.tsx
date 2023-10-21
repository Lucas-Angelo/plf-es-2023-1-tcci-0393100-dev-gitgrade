import { useQuery } from "@tanstack/react-query";
import { EvaluationMethodService } from "../../service/api/evaluationMethod";
import { EvaluationMethodSearchDTO } from "@gitgrade/dtos";

export const getEvaluationMethodQuery = (
    filterOptions?: EvaluationMethodSearchDTO
) => ({
    queryKey: filterOptions
        ? ["evaluationMethod", filterOptions]
        : ["evaluationMethod"],
    queryFn: async () =>
        new EvaluationMethodService()
            .getAll(filterOptions)
            .then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useEvaluationMethodList = (
    filterOptions?: EvaluationMethodSearchDTO
) => useQuery(getEvaluationMethodQuery(filterOptions));

export const getEvaluationMethodByIdQuery = (id: number) => ({
    queryKey: ["evaluationMethod", id] as const,
    queryFn: async () =>
        new EvaluationMethodService().getById(id).then((res) => res.data),
    staleTime: Number.MAX_VALUE,
});

export const useEvaluationMethodById = (id: number) =>
    useQuery(getEvaluationMethodByIdQuery(id));
