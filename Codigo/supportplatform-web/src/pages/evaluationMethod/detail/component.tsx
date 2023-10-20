import { EvaluationMethodResponseDTO } from "@gitgrade/dtos";
import { Box, PageLayout, Heading, Button, Octicon } from "@primer/react";
import { Outlet, useLoaderData } from "react-router";
import Divider from "../../../commom/components/divider";
import { PencilIcon } from "@primer/octicons-react";
import EvaluationMethodAside from "./components/evaluationMethodAside";
import appRoutes from "../../../commom/routes/appRoutes";
import SearchParamControlledModal from "../../../commom/components/searchParamControlledModal";
import EditEvaluationMethodModal from "./editEvaluatioMethodModal";
import { useSearchParams } from "react-router-dom";
import { ArchiveIcon } from "@primer/octicons-react";
import InactivateEvaluationMethodButton from "./components/inactivateEvaluationMethodButton";

const basePageSearchParams = appRoutes.base.search;
const pageModalSearchParamsValues = appRoutes.base.searchValues.modal;

export default function EvaluationMethodDetailPage() {
    const evaluationMethod = useLoaderData() as EvaluationMethodResponseDTO;
    const [, setSearchParams] = useSearchParams();

    function handleEditEvaluationMethodClick() {
        setSearchParams((previousSearchParams) => ({
            ...previousSearchParams,
            [basePageSearchParams.modal]:
                pageModalSearchParamsValues.editEvaluationMethod,
        }));
    }

    return (
        <PageLayout containerWidth="large">
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 3,
                    mx: [0, 0, 4],
                    my: [0, 0, 2],
                    width: "100%",
                    flexWrap: "wrap-reverse",
                }}
            >
                <Heading
                    sx={{
                        fontSize: 20,
                        fontWeight: 400,
                        color: evaluationMethod.disabledAt ? "gray" : undefined,
                    }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            mr: 2,
                        }}
                    >
                        <Octicon icon={ArchiveIcon} />
                    </Box>
                    {evaluationMethod.description} - {evaluationMethod.year}/
                    {evaluationMethod.semester}{" "}
                    {evaluationMethod.disabledAt && "(inativo)"}
                </Heading>
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Button
                        variant="invisible"
                        leadingIcon={PencilIcon}
                        onClick={handleEditEvaluationMethodClick}
                    >
                        Editar
                    </Button>
                    <InactivateEvaluationMethodButton
                        description={evaluationMethod.description}
                        semester={evaluationMethod.semester}
                        year={evaluationMethod.year}
                        disabledAt={evaluationMethod.disabledAt}
                    />
                    <Button disabled>Duplicar</Button>
                </Box>
            </Box>
            <Divider />
            <Box
                sx={{
                    display: ["block", "block", "block", "table"],
                    tableLayout: "fixed",
                    width: "100%",
                }}
            >
                <EvaluationMethodAside />
                <Box display={["block", "block", "block", "table-cell"]}>
                    <Outlet />
                </Box>
            </Box>

            {evaluationMethod && (
                <SearchParamControlledModal
                    header="Editar método avaliativo"
                    openValue={pageModalSearchParamsValues.editEvaluationMethod}
                    searchParam={basePageSearchParams.modal}
                >
                    <EditEvaluationMethodModal
                        description={evaluationMethod.description}
                        year={evaluationMethod.year}
                        id={evaluationMethod.id}
                        semester={evaluationMethod.semester}
                    />
                </SearchParamControlledModal>
            )}
        </PageLayout>
    );
}
