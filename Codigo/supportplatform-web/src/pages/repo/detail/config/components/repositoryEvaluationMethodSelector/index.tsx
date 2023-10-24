import { AnchoredOverlay, Box, Button } from "@primer/react";
import { useCallback, useState } from "react";
import RepositoryEvaluationMethodSelectorModal from "../repositoryEvaluationMethodSelectorModal";

interface IRepositoryEvaluationMethodSelectorProps {
    evaluationMethodString?: string;
    evaluationMethodId?: number;
    repositoryId: number;
}

export default function RepositoryEvaluationMethodSelector(
    props: IRepositoryEvaluationMethodSelectorProps
) {
    const [isOpen, setIsOpen] = useState(false);
    const openOverlay = useCallback(() => setIsOpen(true), [setIsOpen]);
    const closeOverlay = useCallback(() => setIsOpen(false), [setIsOpen]);

    function handleRepositoryEvaluationMethodSave() {
        closeOverlay();
    }

    return (
        <AnchoredOverlay
            renderAnchor={(anchorProps) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    Método Avaliativo
                    <Button
                        {...anchorProps}
                        type="button"
                        aria-label={undefined}
                        sx={{
                            ml: 2,
                            color: !props.evaluationMethodString
                                ? "gray"
                                : undefined,
                        }}
                    >
                        {props.evaluationMethodString ?? "(Nenhum vinculado)"}
                    </Button>
                </Box>
            )}
            open={isOpen}
            onOpen={openOverlay}
            onClose={closeOverlay}
        >
            <RepositoryEvaluationMethodSelectorModal
                evaluationMethodId={props.evaluationMethodId}
                repositoryId={props.repositoryId}
                onClose={handleRepositoryEvaluationMethodSave}
            />
        </AnchoredOverlay>
    );
}
