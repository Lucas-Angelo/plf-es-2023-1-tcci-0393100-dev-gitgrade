import { ActionList, ActionMenu, Text, Truncate } from "@primer/react";
import { useBranchesByRepositoryId } from "../../../commom/data/branch";
import { useMemo } from "react";

interface IBranchSelectorProps {
    repositoryId: number;
    selectedBranch: string;
    onSelectedBranchChange?: (branchName: string) => void;

    defaultBranchName?: string;
}

export default function BranchSelector(props: IBranchSelectorProps) {
    const { data: branchesData } = useBranchesByRepositoryId(
        props.repositoryId
    );

    const orderedBranches = useMemo(
        () =>
            branchesData?.results?.sort((a, b) => {
                if (a.name === props.defaultBranchName) return -1;
                if (b.name === props.defaultBranchName) return 1;
                return 0;
            }),
        [branchesData, props.defaultBranchName]
    );

    return (
        <ActionMenu>
            <ActionMenu.Button>
                <Truncate title={props.selectedBranch}>
                    {props.selectedBranch}
                </Truncate>
            </ActionMenu.Button>

            <ActionMenu.Overlay>
                <ActionList>
                    {orderedBranches?.map((branch) => (
                        <ActionList.Item
                            key={branch.id}
                            onSelect={() =>
                                props.onSelectedBranchChange?.(branch.name)
                            }
                        >
                            <Text sx={{ fontWeight: "bold" }}>
                                {branch.name}
                            </Text>
                        </ActionList.Item>
                    ))}
                </ActionList>
            </ActionMenu.Overlay>
        </ActionMenu>
    );
}
