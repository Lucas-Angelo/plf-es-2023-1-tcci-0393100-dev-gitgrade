import { Box, Select } from "@primer/react";
import { useEvaluationMethodConsistencyRuleList } from "../../../../../../commom/data/consistencyRule";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";

interface IConsistencyDeliveryRuleFilterProps {
    evaluationMethodId: number | undefined;
}

const pageSearchParams = appRoutes.repo.detail.consistency.search;

export default function ConsistencyRuleFilter(
    props: IConsistencyDeliveryRuleFilterProps
) {
    const [searchParams, setSearchParams] = useSearchParams();
    const consistencyRuleParam =
        searchParams.get(pageSearchParams.consistencyRuleId) ?? "";
    const consistencyRuleId = Number(consistencyRuleParam) || undefined;

    const { data: consistencyRuleList, isLoading } =
        useEvaluationMethodConsistencyRuleList(
            props.evaluationMethodId!,
            {
                limit: 1000,
            },
            Boolean(props.evaluationMethodId)
        );

    const consistencyRule = consistencyRuleList?.results.find(
        (consistencyRule) => consistencyRule.id == consistencyRuleId
    );

    function handleConsistencyRuleSelectChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        const consistencyRuleId = event.target.value;
        setSearchParams((previousSearchParams) => {
            if (!consistencyRuleId) {
                previousSearchParams.delete(pageSearchParams.consistencyRuleId);
            } else {
                previousSearchParams.set(
                    pageSearchParams.consistencyRuleId,
                    String(consistencyRuleId)
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
            <Select
                value={consistencyRule?.id.toString()}
                sx={{
                    maxWidth: "300px",
                }}
                onChange={handleConsistencyRuleSelectChange}
                disabled={!props.evaluationMethodId}
            >
                {isLoading && (
                    <Select.Option
                        value="-1"
                        disabled
                    >
                        Carregando...
                    </Select.Option>
                )}
                <Select.Option value="">
                    {consistencyRule
                        ? "Limpar filtro"
                        : "Filtrar por Regra de Consistência"}
                </Select.Option>
                {consistencyRuleList?.results.map((consistencyRule) => (
                    <Select.Option
                        key={consistencyRule.id}
                        value={consistencyRule.id.toString()}
                    >
                        {consistencyRule.description} (
                        {consistencyRule.filePath})
                    </Select.Option>
                ))}
            </Select>
        </Box>
    );
}
