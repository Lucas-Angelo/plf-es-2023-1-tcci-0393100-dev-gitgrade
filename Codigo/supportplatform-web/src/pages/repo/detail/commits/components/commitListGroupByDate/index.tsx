import { CommitResponseDTO } from "@gitgrade/dtos";
import { Octicon, Timeline } from "@primer/react";
import { CommitIcon } from "@primer/octicons-react";
import { useMemo } from "react";
import { groupBy } from "../../../../../../commom/utils/array";
import CommitCard from "../commitCard";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";

interface ICommitListGroupByDateProps {
    commits: CommitResponseDTO[];
    repoName: string;
}

const dateFormater = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

function getCommitDate(commit: CommitResponseDTO) {
    const commitedDate = new Date(commit.committedDate);
    return commitedDate.toISOString().split("T")[0];
}

const pageSearchParams = {
    ...appRoutes.repo.detail.search,
    ...appRoutes.repo.detail.commits.search,
};

export default function CommitListGroupByDate(
    props: ICommitListGroupByDateProps
) {
    const [, setSearchParams] = useSearchParams();
    const commitsByDate = useMemo(
        () =>
            Array.from(groupBy(props.commits, getCommitDate).entries())
                .sort()
                .reverse(),
        [props.commits]
    );

    function handleAvatarClick(githubLogin: string | null) {
        setSearchParams((previousSearchParams) => {
            const newSearchParams = new URLSearchParams(previousSearchParams);
            newSearchParams.delete(pageSearchParams.page);

            if (githubLogin) {
                newSearchParams.set(pageSearchParams.contributor, githubLogin);
                newSearchParams.delete(
                    pageSearchParams.filterWithNoContributor
                );
            } else {
                newSearchParams.delete(pageSearchParams.contributor);
                newSearchParams.set(
                    pageSearchParams.filterWithNoContributor,
                    "true"
                );
            }

            return newSearchParams;
        });
    }

    return (
        <Timeline>
            {commitsByDate.map(([dateString, commits]) => (
                <Timeline.Item key={dateString}>
                    <Timeline.Badge>
                        <Octicon icon={CommitIcon} />
                    </Timeline.Badge>
                    <Timeline.Body>
                        Commits em {dateFormater.format(new Date(dateString))}
                        {commits.map((commit, index) => (
                            <CommitCard
                                key={commit.id}
                                message={commit.message}
                                commitedDate={new Date(commit.committedDate)}
                                contributor={commit.contributor}
                                sha={commit.sha}
                                isFirst={index === 0}
                                isLast={index === commits.length - 1}
                                repoName={props.repoName}
                                onAvatarClick={handleAvatarClick}
                            />
                        ))}
                    </Timeline.Body>
                </Timeline.Item>
            ))}
        </Timeline>
    );
}
