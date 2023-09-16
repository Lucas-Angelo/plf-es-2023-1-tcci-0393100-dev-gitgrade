import {
    Avatar,
    Box,
    Button,
    Label,
    Link,
    Octicon,
    UnderlineNav2,
} from "@primer/react";
import {
    RepoIcon,
    PaperclipIcon,
    GraphIcon,
    CodeIcon,
    IssueOpenedIcon,
    ClockIcon,
    GearIcon,
} from "@primer/octicons-react";

import "./styles.css";
import UnderlineNavItemLink from "../../../../../commom/components/underlineNavItemLink";
import appRoutes from "../../../../../commom/routes/appRoutes";

interface IRepoHeadProps {
    orgName: string;
    repoName: string;
    evaluationMethodName?: string;
    contributors?: Array<{
        githubName?: string | null;
        githubLogin: string | null;
        githubAvatarUrl: string | null;
    }>;
}

const repoRoutes = appRoutes.repo[":id"];

export default function RepoHead(props: IRepoHeadProps) {
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
                    {props.contributors?.map((contributor) => (
                        <Avatar
                            src={contributor.githubAvatarUrl!}
                            key={contributor.githubLogin}
                            size={20}
                            title={
                                (contributor.githubName ||
                                    contributor.githubLogin) ??
                                "Sem nome"
                            }
                        />
                    ))}
                </Box>

                <Box>
                    <Label variant="accent">método_avaliativo</Label>
                </Box>

                <Box>
                    <Button variant="primary">Sincronizar</Button>
                </Box>
            </Box>

            <Box className="underline-nav-wrapper">
                <UnderlineNav2
                    aria-label="Repository"
                    sx={{
                        mb: 0,
                    }}
                >
                    <UnderlineNavItemLink
                        to={repoRoutes.metrics.path}
                        aria-current="page"
                    >
                        <Box>
                            <Octicon
                                icon={GraphIcon}
                                sx={{ mr: 2 }}
                                color="fg.muted"
                            />
                            Métricas do repositório
                        </Box>
                    </UnderlineNavItemLink>
                    <UnderlineNavItemLink to={repoRoutes.quality.path}>
                        <Box>
                            <Octicon
                                icon={CodeIcon}
                                sx={{ mr: 2 }}
                                color="fg.muted"
                            />
                            Qualidade de código
                        </Box>
                    </UnderlineNavItemLink>
                    <UnderlineNavItemLink to={repoRoutes.commits.path}>
                        <Box>
                            <Octicon
                                icon={ClockIcon}
                                sx={{ mr: 2 }}
                                color="fg.muted"
                            />
                            Histórico de commits
                        </Box>
                    </UnderlineNavItemLink>
                    <UnderlineNavItemLink to={repoRoutes.consistency.path}>
                        <Box>
                            <Octicon
                                icon={IssueOpenedIcon}
                                sx={{ mr: 2 }}
                                color="fg.muted"
                            />
                            Consistência
                        </Box>
                    </UnderlineNavItemLink>
                    <UnderlineNavItemLink to="config">
                        <Box>
                            <Octicon
                                icon={GearIcon}
                                sx={{ mr: 2 }}
                                color="fg.muted"
                            />
                            Configurações
                        </Box>
                    </UnderlineNavItemLink>
                </UnderlineNav2>
            </Box>
        </Box>
    );
}
