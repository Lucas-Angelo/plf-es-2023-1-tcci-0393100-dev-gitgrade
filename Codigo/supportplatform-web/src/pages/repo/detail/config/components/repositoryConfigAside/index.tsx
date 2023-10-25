import { Box, NavList, Text } from "@primer/react";
import NavListItem from "../../../../../../commom/components/navListItem";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import { useSearchParamsString } from "../../../../../../commom/hooks/useRemainingSearchParams";

const repositoryConfigRoutes = appRoutes.repo["detail"].config;

export default function RepositoryConfigAside() {
    const searchParamsString = useSearchParamsString();

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
                    <NavListItem
                        to={repositoryConfigRoutes.general.path.concat(
                            searchParamsString
                        )}
                    >
                        <Text sx={{ fontWeight: "bold" }}>Geral</Text>
                    </NavListItem>
                    <NavListItem
                        to={repositoryConfigRoutes.branches.path.concat(
                            searchParamsString
                        )}
                    >
                        <Text sx={{ fontWeight: "bold" }}>Branches</Text>
                    </NavListItem>
                </NavList>
            </Box>
        </Box>
    );
}
