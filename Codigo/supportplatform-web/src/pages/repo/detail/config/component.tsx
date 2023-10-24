import { Box } from "@primer/react";
import RepositoryEvaluationMethodSelector from "./components/repositoryEvaluationMethodSelector";
import { useRepositoryById } from "../../../../commom/data/repo";
import appRoutes from "../../../../commom/routes/appRoutes";
import { useParams } from "react-router";
import RepositoryAutoSyncToggle from "./components/repositoryAutoSyncToggle";

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
            {repository && (
                <RepositoryAutoSyncToggle
                    automaticSynchronization={
                        repository.automaticSynchronization
                    }
                    repositoryId={repository.id}
                />
            )}

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
