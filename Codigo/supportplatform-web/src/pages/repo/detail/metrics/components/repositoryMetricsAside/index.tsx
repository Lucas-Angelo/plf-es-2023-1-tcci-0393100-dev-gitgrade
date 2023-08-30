import { ActionList, ActionMenu, Box, NavList, Text } from "@primer/react";
import NavListItem from "../../../../../../commom/components/navListItem";
import appRoutes from "../../../../../../commom/routes/appRoutes";

const repositoryMetricsRoutes = appRoutes.repo[":id"].metrics;

export default function RepositoryMetricsAside() {
    return (
        <Box
            as={"aside"}
            sx={{
                width: ["100%", "100%", "300px"],
            }}
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
            <Box
                sx={{
                    height: 1,
                    width: "100%",
                    bg: "border.default",
                    my: 3,
                }}
            ></Box>

            <Box>
                <Text
                    color="gray"
                    sx={{ ml: 2 }}
                >
                    Branch
                </Text>
                <ActionMenu>
                    <ActionMenu.Button>master</ActionMenu.Button>

                    <ActionMenu.Overlay>
                        <ActionList>
                            <ActionList.Item>
                                <Text sx={{ fontWeight: "bold" }}>master</Text>
                            </ActionList.Item>
                            <ActionList.Item>
                                <Text sx={{ fontWeight: "bold" }}>dev</Text>
                            </ActionList.Item>
                        </ActionList>
                    </ActionMenu.Overlay>
                </ActionMenu>
            </Box>
        </Box>
    );
}
