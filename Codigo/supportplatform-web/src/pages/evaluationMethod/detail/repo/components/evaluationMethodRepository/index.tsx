import { Box, Button } from "@primer/react";
import RepoCard from "../../../../../../commom/components/repoCard";
import { useFetcher } from "react-router-dom";
import { XIcon } from "@primer/octicons-react";

interface IEvaluationMethodRepositoryProps {
    name: string;
    id: number;
}

export default function EvaluationMethodRepository(
    props: IEvaluationMethodRepositoryProps
) {
    const fetcher = useFetcher();

    return (
        <Box sx={{ mb: 3 }}>
            <RepoCard
                name={props.name}
                id={props.id}
                key={props.id}
            >
                <fetcher.Form
                    method="delete"
                    action={props.id.toString()}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            variant="danger"
                            leadingIcon={XIcon}
                            disabled={fetcher.state === "submitting"}
                            type="submit"
                        >
                            Remover
                        </Button>
                    </Box>
                </fetcher.Form>
            </RepoCard>
        </Box>
    );
}
