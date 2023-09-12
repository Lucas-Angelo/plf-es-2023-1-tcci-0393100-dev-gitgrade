import { Box, NavList, Text } from "@primer/react";
import NavListItem from "../../../../../../commom/components/navListItem";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useRepositoryById } from "../../../../../../commom/data/repo";
import { useParams } from "react-router";
import Divider from "../../../../../../commom/components/divider";
import BranchQueryNavigationMenu from "../branchQueryNavigationMenu";

const repositoryMetricsRoutes = appRoutes.repo[":id"].metrics;

const pageRouteParams = appRoutes.repo[":id"].params;
type PageRouteParams = (typeof pageRouteParams)[number];

export default function RepositoryMetricsAside() {
    const params = useParams<PageRouteParams>();
    const id = Number(params.id);

    const { data: repositoryData } = useRepositoryById(id);

    return (
        <Box
            as={"aside"}
            display={["block", "block", "block", "table-cell"]}
            sx={{
                width: ["100%", "100%", "100%", "300px"],
            }}
            mr={[0, 0, 0, 3]}
            mb={[6, 6, 6, 0]}
        >
            <Box>
                <NavList>
                    <Text
                        color="gray"
                        sx={{ ml: 2 }}
                    >
                        Informação
                    </Text>
                    <NavListItem to={repositoryMetricsRoutes.commits.path}>
                        <Text sx={{ fontWeight: "bold" }}>
                            Contribuições de Commits
                        </Text>
                    </NavListItem>
                    <NavListItem to={repositoryMetricsRoutes.fileTypes.path}>
                        <Text sx={{ fontWeight: "bold" }}>
                            Tipos de arquivos contribuidos
                        </Text>
                    </NavListItem>
                    <NavListItem to={repositoryMetricsRoutes.linesOfCode.path}>
                        <Text sx={{ fontWeight: "bold" }}>
                            Contribuições de Linhas de código
                        </Text>
                    </NavListItem>
                    <NavListItem
                        to={repositoryMetricsRoutes.fileContributions.path}
                    >
                        <Text sx={{ fontWeight: "bold" }}>
                            Contribuições de Arquivos
                        </Text>
                    </NavListItem>
                    <NavListItem
                        to={repositoryMetricsRoutes.commitQuality.path}
                    >
                        <Text sx={{ fontWeight: "bold" }}>
                            Qualidade da descrição dos commits
                        </Text>
                    </NavListItem>
                    <NavListItem to={repositoryMetricsRoutes.closedIssues.path}>
                        <Text sx={{ fontWeight: "bold" }}>Issues fechadas</Text>
                    </NavListItem>
                </NavList>
            </Box>

            {/* divider box */}
            <Divider />

            <Box>
                <Text
                    color="gray"
                    sx={{ ml: 2 }}
                >
                    Branch
                </Text>
                <BranchQueryNavigationMenu
                    defaultBranchName={repositoryData!.defaultBranch}
                    repositoryId={id}
                />
            </Box>
        </Box>
    );
}
