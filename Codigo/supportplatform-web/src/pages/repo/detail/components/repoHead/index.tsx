import { Box, Button, Label, Link, Octicon } from "@primer/react";
import { RepoIcon, PaperclipIcon } from "@primer/octicons-react";

import "./styles.css";
import ContributorFilter from "../contributorFilter";
import RepoHeadNavigation from "../repoHeadNavigation";
import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../commom/routes/appRoutes";

interface IRepoHeadProps {
    orgName: string;
    repoName: string;
    evaluationMethodName?: string;
    contributors?: Array<{
        id: number;
        githubName?: string | null;
        githubLogin: string | null;
        githubAvatarUrl: string | null;
    }>;
}

const pageSearchParams = appRoutes.repo.detail.search;

export default function RepoHead(props: IRepoHeadProps) {
    const [searchParams] = useSearchParams();

    return (
        <Box
            sx={{
                bg: "canvas.subtle",
                px: [2, 4],
                pt: [2, 3],
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: 3,
                    mb: 3,
                }}
            >
                <Box
                    sx={{
                        mr: 2,
                    }}
                >
                    <Octicon
                        icon={RepoIcon}
                        color="fg.muted"
                    />
                    <Link
                        target="_blank"
                        href={`https://github.com/${props.orgName}/${props.repoName}`}
                        sx={{
                            fontWeight: "bolder",
                        }}
                    >
                        {" "}
                        {props.repoName}
                        <Octicon
                            icon={PaperclipIcon}
                            sx={{ ml: 4 }}
                            color="fg.muted"
                        />
                    </Link>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexGrow: 1,
                    }}
                >
                    <ContributorFilter
                        key={`${searchParams
                            .getAll(pageSearchParams.contributor)
                            .join(";")}${searchParams.get(
                            pageSearchParams.filterWithNoContributor
                        )}`}
                        contributors={props.contributors}
                    />
                </Box>

                <Box>
                    <Label variant="accent">método_avaliativo</Label>
                </Box>

                <Box>
                    <Button variant="primary">Sincronizar</Button>
                </Box>
            </Box>

            <Box className="underline-nav-wrapper">
                <RepoHeadNavigation />
            </Box>
        </Box>
    );
}
