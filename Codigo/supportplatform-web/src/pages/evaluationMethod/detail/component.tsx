import { EvaluationMethodResponseDTO } from "@gitgrade/dtos";
import { Box, PageLayout, Heading, Button } from "@primer/react";
import { Outlet, useLoaderData } from "react-router";
import Divider from "../../../commom/components/divider";
import { PencilIcon } from "@primer/octicons-react";
import EvaluationMethodAside from "./components/evaluationMethodAside";

export default function EvaluationMethodDetailPage() {
    const evaluationMethod = useLoaderData() as EvaluationMethodResponseDTO;

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
                    }}
                >
                    {evaluationMethod.description} - {evaluationMethod.year}/
                    {evaluationMethod.semester}
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
                    >
                        Editar
                    </Button>
                    <Button variant="danger">Inativar</Button>
                    <Button>Sicronizar </Button>
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
        </PageLayout>
    );
}
