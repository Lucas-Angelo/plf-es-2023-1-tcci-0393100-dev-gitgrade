import { Box } from "@primer/react";

import RepoCard from "../../../../../commom/components/repoCard";
import { useRepositoryById } from "../../../../../commom/data/repo";

interface IRepositoryRowProps {
    name: string;
    id: number;
    evaluationMethod?: {
        id: number;
        description: string;
        semester: number;
        year: number;
    };
}

export default function RepositoryRow(props: IRepositoryRowProps) {
    const repo = props;
    const synchronizing = useRepositoryById(repo.id).data?.synchronizing;

    return (
        <Box sx={{ mb: 3 }}>
            <RepoCard
                name={repo.name}
                evaluationMethod={repo.evaluationMethod ?? undefined}
                synchronizing={synchronizing}
                id={repo.id}
                key={repo.id}
            />
        </Box>
    );
}
