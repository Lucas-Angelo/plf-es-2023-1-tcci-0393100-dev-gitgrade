import { Box, NavList, Octicon, Text } from "@primer/react";
import NavListItem from "../../../../../commom/components/navListItem";
import appRoutes from "../../../../../commom/routes/appRoutes";
import {
    RepoIcon,
    TasklistIcon,
    MoonIcon,
    IssueOpenedIcon,
} from "@primer/octicons-react";

const evaluationMethodPageRoutes = appRoutes.evaluationMethod.detail;

export default function EvaluationMethodAside() {
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
                    <NavListItem to={evaluationMethodPageRoutes.repo.path}>
                        <Octicon
                            sx={{ mr: 4 }}
                            icon={RepoIcon}
                        />
                        <Text sx={{ fontWeight: "bold" }}>Repositórios</Text>
                    </NavListItem>
                    <NavListItem
                        to={evaluationMethodPageRoutes.consistencyRule.path}
                    >
                        <Octicon
                            sx={{ mr: 4 }}
                            icon={TasklistIcon}
                        />
                        <Text sx={{ fontWeight: "bold" }}>
                            Regras de consistência
                        </Text>
                    </NavListItem>
                    <NavListItem to={evaluationMethodPageRoutes.sprint.path}>
                        <Octicon
                            sx={{ mr: 4 }}
                            icon={MoonIcon}
                        />
                        <Text sx={{ fontWeight: "bold" }}>Sprints</Text>
                    </NavListItem>
                    <NavListItem
                        to={evaluationMethodPageRoutes.standardizedIssue.path}
                    >
                        <Octicon
                            sx={{ mr: 4 }}
                            icon={IssueOpenedIcon}
                        />
                        <Text sx={{ fontWeight: "bold" }}>
                            Issues padronizadas
                        </Text>
                    </NavListItem>
                </NavList>
            </Box>
        </Box>
    );
}
