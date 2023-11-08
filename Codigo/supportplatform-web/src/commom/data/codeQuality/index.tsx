import { useQuery } from "@tanstack/react-query";
import { CodeQualityService } from "../../service/api/codeQuality";
import {
    CodeQualitySearchDTO,
    CodeQualityStatus,
} from "@gitgrade/dtos/dto/codeQuality";

export const getRepositoryCodeQualityQuery = (
    repositoryId: number,
    queryDto?: CodeQualitySearchDTO
) => {
    return {
        queryKey: queryDto
            ? ["code-quality", "repository", repositoryId, queryDto]
            : ["code-quality", "repository", repositoryId],
        queryFn: async () =>
            new CodeQualityService()
                .getAll(repositoryId, queryDto)
                .then((res) => res.data),
        staleTime: Number.MAX_VALUE,
    };
};

export const useRepositoryCodeQualityList = (
    repositoryId: number,
    queryDto?: CodeQualitySearchDTO
) =>
    useQuery({
        ...getRepositoryCodeQualityQuery(repositoryId, queryDto),
        refetchInterval: (data) => {
            if (
                data?.results.some(
                    (d) => d.status === CodeQualityStatus.ANALYZING
                )
            ) {
                return 60 * 1000;
            }

            return false;
        },
    });
