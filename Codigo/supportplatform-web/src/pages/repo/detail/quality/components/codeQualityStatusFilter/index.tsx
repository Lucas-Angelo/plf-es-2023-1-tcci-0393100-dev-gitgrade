import { Box, Select } from "@primer/react";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useSearchParams } from "react-router-dom";
import React from "react";
import { CodeQualityStatus } from "@gitgrade/dtos/dto/codeQuality";

const pageRouteSearchParams = appRoutes.repo.detail.quality.search;

const codeQualityStatusArray: Array<{
    status: CodeQualityStatus;
    name: string;
}> = [
    {
        status: CodeQualityStatus.ANALYZING,
        name: "Análise em andamento",
    },
    {
        status: CodeQualityStatus.ANALYZED,
        name: "Análise concluída",
    },
    {
        status: CodeQualityStatus.ERROR,
        name: "Erro na análise",
    },
];

export default function CodeQualityStatusFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    const statusParam = searchParams.get(pageRouteSearchParams.status) ?? "";
    const selectedStatus = codeQualityStatusArray.find(
        (statusObj) => statusObj.status.toString() === statusParam
    )?.status;

    function handleCodeQualityStatusSelectChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        const codeQualityStatus: string = event.target.value;
        setSearchParams((previousSearchParams) => {
            if (!codeQualityStatus) {
                previousSearchParams.delete(pageRouteSearchParams.status);
            } else {
                previousSearchParams.set(
                    pageRouteSearchParams.status,
                    String(codeQualityStatus)
                );
            }
            return previousSearchParams;
        });
    }

    return (
        <Box
            sx={{
                maxWidth: "150px",
            }}
        >
            <Select onChange={handleCodeQualityStatusSelectChange}>
                <Select.Option value="">
                    {selectedStatus ? "Limpar filtro" : "Filtrar por status"}
                </Select.Option>
                {codeQualityStatusArray.map((statusObj) => (
                    <Select.Option
                        key={statusObj.status.toString()}
                        value={statusObj.status.toString()}
                    >
                        {statusObj.name}
                    </Select.Option>
                ))}
            </Select>
        </Box>
    );
}
