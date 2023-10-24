import { ToggleSwitch, Box } from "@primer/react";
import RepositoryEvaluationMethodSelector from "./components/repositoryEvaluationMethodSelector";
import { useRepositoryById } from "../../../../commom/data/repo";
import appRoutes from "../../../../commom/routes/appRoutes";
import { useParams } from "react-router";

const pageRouteParams = appRoutes.repo["detail"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

const datetimeFormat = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
});

export default function RepositoryConfigPage() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);
    const { data: repository } = useRepositoryById(id);

    const evaluationMethodName = repository?.evaluationMethod
        ? `${repository.evaluationMethod.description} - ${repository.evaluationMethod.year}/${repository.evaluationMethod.semester}`
        : undefined;

    return (
        <Box>
            {repository && (
                <RepositoryEvaluationMethodSelector
                    evaluationMethodId={repository.evaluationMethod?.id}
                    repositoryId={repository.id}
                    evaluationMethodString={evaluationMethodName}
                />
            )}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 4,
                }}
                className="toggle-switch-wrapper"
            >
                Sincronização automática
                <ToggleSwitch aria-labelledby="Sincronização automática" />
            </Box>

            {repository?.lastSyncAt && (
                <Box
                    sx={{
                        mt: 4,
                    }}
                >
                    Última Sincronização em{" "}
                    {datetimeFormat.format(new Date(repository.lastSyncAt))}
                </Box>
            )}
        </Box>
    );
}
