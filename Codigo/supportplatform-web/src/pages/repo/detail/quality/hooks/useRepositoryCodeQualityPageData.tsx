import { useParams } from "react-router";
import { useRepositoryCodeQualityList } from "../../../../../commom/data/codeQuality";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { useSearchParams } from "react-router-dom";
import { CodeQualityStatus } from "@gitgrade/dtos/dto/codeQuality";

type PagePathParam = (typeof appRoutes.repo.detail.params)[number];
const pageSearchParams = appRoutes.repo.detail.quality.search;

export function useRepositoryCodeQualityPageData() {
    const repositoryIdParam = useParams<PagePathParam>().id;
    const repositoryId = Number(repositoryIdParam);

    const [searchParams] = useSearchParams();

    const { data: codeQualityAnalisysResponse } = useRepositoryCodeQualityList(
        repositoryId,
        {
            page: Number(searchParams.get(pageSearchParams.page)) || 1,
            status: searchParams.get(pageSearchParams.status) as
                | CodeQualityStatus
                | undefined,
        }
    );

    return codeQualityAnalisysResponse;
}
