import { UnderlineNav2, Box, Octicon } from "@primer/react";
import UnderlineNavItemLink from "../../../../../commom/components/underlineNavItemLink";
import {
    GraphIcon,
    CodeIcon,
    IssueOpenedIcon,
    ClockIcon,
    GearIcon,
} from "@primer/octicons-react";
import appRoutes from "../../../../../commom/routes/appRoutes";
import { useSearchParamsString } from "../../../../../commom/hooks/useRemainingSearchParams";

const repoRoutes = appRoutes.repo["detail"];
const repoPageSearchParamsList = repoRoutes.getSearchParamsList();

export default function RepoHeadNavigation() {
    const searchParamsString = useSearchParamsString({
        include: repoPageSearchParamsList,
    });

    return (
        <UnderlineNav2
            aria-label="Repository"
            sx={{
                mb: 0,
            }}
        >
            <UnderlineNavItemLink
                to={repoRoutes.metrics.path.concat(searchParamsString)}
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
            <UnderlineNavItemLink
                to={repoRoutes.quality.path.concat(searchParamsString)}
            >
                <Box>
                    <Octicon
                        icon={CodeIcon}
                        sx={{ mr: 2 }}
                        color="fg.muted"
                    />
                    Qualidade de código
                </Box>
            </UnderlineNavItemLink>
            <UnderlineNavItemLink
                to={repoRoutes.commits.path.concat(searchParamsString)}
            >
                <Box>
                    <Octicon
                        icon={ClockIcon}
                        sx={{ mr: 2 }}
                        color="fg.muted"
                    />
                    Histórico de commits
                </Box>
            </UnderlineNavItemLink>
            <UnderlineNavItemLink
                to={repoRoutes.consistency.path.concat(searchParamsString)}
            >
                <Box>
                    <Octicon
                        icon={IssueOpenedIcon}
                        sx={{ mr: 2 }}
                        color="fg.muted"
                    />
                    Consistência
                </Box>
            </UnderlineNavItemLink>
            <UnderlineNavItemLink
                to={repoRoutes.config.path.concat(searchParamsString)}
            >
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
    );
}
