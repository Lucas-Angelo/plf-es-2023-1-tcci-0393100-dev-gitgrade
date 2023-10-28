import { useLoaderData, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../commom/routes/appRoutes";
import { useRepositoryById } from "../../../../commom/data/repo";
import { Box, Pagination } from "@primer/react";
import { RepositoryConsistencyRuleDeliveryListLoaderData } from "./loader";
import ConsistencyDeliveryTimeline from "./components/consistencyDeliveryTimeline";
import ConsistencyDeliveryFilter from "./components/consistencyDeliveryFilter";

const pageRouteParams = appRoutes.repo.detail.params;
type PageRouteParams = (typeof pageRouteParams)[number];

const pageSearchParams = appRoutes.repo.detail.commits.search;

export default function RepositoryConsitencyRuleDeliveriesPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get(pageSearchParams.page)) || 1;

    const { data: repositoryData } = useRepositoryById(id);
    const { results, totalPages } =
        useLoaderData() as RepositoryConsistencyRuleDeliveryListLoaderData;

    function handlePageChange(e: React.MouseEvent, page: number) {
        e.preventDefault();
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(pageSearchParams.page, String(page));
            return previousSearchParams;
        });
    }

    if (!repositoryData) {
        return null;
    }

    return (
        <Box>
            <ConsistencyDeliveryFilter
                evaluationMethodId={repositoryData.evaluationMethod?.id}
            />
            <ConsistencyDeliveryTimeline
                consistencyRuleDeliveryList={results}
            />
            <Pagination
                currentPage={page}
                pageCount={totalPages}
                onPageChange={handlePageChange}
                hrefBuilder={(n) => `?${pageSearchParams.page}=${n}`}
            />
        </Box>
    );
}
