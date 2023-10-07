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
