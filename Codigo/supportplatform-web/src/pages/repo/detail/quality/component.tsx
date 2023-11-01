import appRoutes from "../../../../commom/routes/appRoutes";
import { Box, Pagination } from "@primer/react";
import CommitQualityAnalisysTimeline from "./components/commitQualityAnalisysTimeline";
import CreateQualityAnalisysButton from "./components/createQualityAnalisysButton";
import { CodeQualityStatusDto } from "@gitgrade/dtos/dto/codeQuality";
import { useSearchParams } from "react-router-dom";
import CodeQualityStatusFilter from "./components/codeQualityStatusFilter";
import { useRepositoryCodeQualityPageData } from "./hooks/useRepositoryCodeQualityPageData";

const pageSearchParams = appRoutes.repo.detail.quality.search;

export default function RepositoryCodeQualityPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get(pageSearchParams.page)) || 1;

    const codeQualityAnalisysResponse = useRepositoryCodeQualityPageData();

    const someCodeQualityAnalisysIsAnalyzing =
        codeQualityAnalisysResponse?.results.some(
            (codeQualityAnalisys) =>
                codeQualityAnalisys.status === CodeQualityStatusDto.ANALYZING
        );

    function handlePageChange(e: React.MouseEvent, page: number) {
        e.preventDefault();
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(pageSearchParams.page, String(page));
            return previousSearchParams;
        });
    }

    if (!codeQualityAnalisysResponse) {
        return null;
    }
    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <CodeQualityStatusFilter />
                <CreateQualityAnalisysButton
                    analyzing={someCodeQualityAnalisysIsAnalyzing}
                />
            </Box>

            <CommitQualityAnalisysTimeline
                codeQualityAnalisysList={codeQualityAnalisysResponse.results}
            />

            {codeQualityAnalisysResponse.results.length === 0 && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        color: "gray",
                    }}
                >
                    Nenhuma análise de código foi executada neste repositório.
                </Box>
            )}

            <Pagination
                currentPage={page}
                pageCount={codeQualityAnalisysResponse.totalPages}
                onPageChange={handlePageChange}
                hrefBuilder={(n) => `?${pageSearchParams.page}=${n}`}
            />
        </Box>
    );
}
