import { Box, Button, Checkbox } from "@primer/react";
import RepoCard from "../../../../../../commom/components/repoCard";
import { useFetcher } from "react-router-dom";
import { XIcon } from "@primer/octicons-react";
import { useRepositoryById } from "../../../../../../commom/data/repo";

interface IEvaluationMethodRepositoryProps {
    name: string;
    id: number;

    checked?: boolean;
    onChecked?: (checked: boolean) => void;

    synchronizing: boolean | undefined;
    lastSyncAt: Date | undefined;
}

export default function EvaluationMethodRepository(
    props: IEvaluationMethodRepositoryProps
) {
    const synchronizing =
        useRepositoryById(props.id).data?.synchronizing || props.synchronizing;
    const fetcher = useFetcher();

    return (
        <Box sx={{ mb: 3, display: "flex", gap: 3, alignItems: "center" }}>
            <Checkbox
                checked={props.checked}
                disabled={synchronizing}
                sx={{
                    cursor: synchronizing ? "not-allowed" : "pointer",
                }}
                onChange={(e) => {
                    if (props.onChecked) {
                        props.onChecked(e.target.checked);
                    }
                }}
            />
            <RepoCard
                name={props.name}
                id={props.id}
                key={props.id}
                synchronizing={synchronizing}
                lastSyncAt={props.lastSyncAt}
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
