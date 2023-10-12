import { ActionList, ActionMenu, Box, Octicon } from "@primer/react";
import {
    TriangleDownIcon,
    PlusIcon,
    ArchiveIcon,
} from "@primer/octicons-react";
import appRoutes from "../../../../commom/routes/appRoutes";
import { useSearchParams } from "react-router-dom";

const pageSearchParams = appRoutes.base.search;

export default function AddMenu() {
    const [, setSearchParams] = useSearchParams();

    function handleAddEvaluationMethodClick() {
        setSearchParams((previousSearchParams) => ({
            ...previousSearchParams,
            [pageSearchParams.creating]: "evaluationMethod",
        }));
    }

    return (
        <Box>
            <ActionMenu>
                <ActionMenu.Anchor>
                    <Box
                        sx={{
                            ":hover": {
                                bg: "gray",
                            },
                            p: 1,
                            borderRadius: 4,
                        }}
                    >
                        <Octicon icon={PlusIcon} />
                        <Octicon icon={TriangleDownIcon} />
                    </Box>
                </ActionMenu.Anchor>

                <ActionMenu.Overlay
                    sx={{
                        mt: 3,
                    }}
                >
                    <ActionList>
                        <ActionList.Item
                            sx={{ color: "grayText" }}
                            onSelect={handleAddEvaluationMethodClick}
                        >
                            <Octicon
                                icon={ArchiveIcon}
                                sx={{ mr: 1 }}
                            />{" "}
                            Novo método avaliativo
                        </ActionList.Item>
                    </ActionList>
                </ActionMenu.Overlay>
            </ActionMenu>
        </Box>
    );
}
