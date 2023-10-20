import { useParams } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";
import { useContributorsByRepositoryId } from "../../../../commom/data/contributor";

const pageRouteParams = appRoutes.repo["detail"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

export function usePageRepositoryContributors() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    const { data: repositoryContributorsData } =
        useContributorsByRepositoryId(id);

    return repositoryContributorsData;
}
