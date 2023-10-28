import Card from "../../../../../../../commom/components/card";
import { Box, Label } from "@primer/react";
import BranchAutomaticSyncToggle from "../branchAutomaticSyncToggle";

interface IBranchCardProps {
    name: string;
    commit_automatic_synchronization: boolean;
    file_automatic_synchronization: boolean;
    repositoryId: number;
    id: number;

    isDefaultBranch?: boolean;
}

export default function BranchCard(props: IBranchCardProps) {
    return (
        <Card.Root>
            <Card.Title>
                <Box
                    sx={{
                        fontWeight: "bold",
                    }}
                >
                    {props.name}
                </Box>
                {props.isDefaultBranch && (
                    <Card.Labels>
                        <Label variant="done">Branch padrão</Label>
                    </Card.Labels>
                )}
            </Card.Title>

            <Card.Actions>
                <Box sx={{ flexGrow: 1 }}>
                    <Box>Sincronizar:</Box>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                        }}
                    >
                        <BranchAutomaticSyncToggle
                            syncType="commit"
                            repositoryId={props.repositoryId}
                            branchId={props.id}
                            ariaLabelledBy="sincronizar commits"
                            defaultChecked={
                                props.commit_automatic_synchronization
                            }
                            isDefaultBranch={props.isDefaultBranch}
                        >
                            Commits
                        </BranchAutomaticSyncToggle>
                        <BranchAutomaticSyncToggle
                            syncType="file"
                            repositoryId={props.repositoryId}
                            branchId={props.id}
                            ariaLabelledBy="sincronizar arquivos"
                            defaultChecked={
                                props.file_automatic_synchronization
                            }
                            isDefaultBranch={props.isDefaultBranch}
                        >
                            Arquivos
                        </BranchAutomaticSyncToggle>
                    </Box>
                </Box>
            </Card.Actions>
        </Card.Root>
    );
}
