import { AnchoredOverlay, IconButton, Box } from "@primer/react";
import { useCallback, useState } from "react";
import { FilterIcon } from "@primer/octicons-react";

export default function RepositoryEvaluationMethodSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const openOverlay = useCallback(() => setIsOpen(true), [setIsOpen]);
    const closeOverlay = useCallback(() => setIsOpen(false), [setIsOpen]);

    return (
        <AnchoredOverlay
            renderAnchor={(anchorProps) => (
                <Box>
                    Método Avliativo
                    <IconButton
                        icon={FilterIcon}
                        {...anchorProps}
                        aria-label={undefined}
                        aria-labelledby="filtro"
                        sx={{ ml: 2 }}
                    />
                </Box>
            )}
            open={isOpen}
            onOpen={openOverlay}
            onClose={closeOverlay}
        >
            Olá rapazes
        </AnchoredOverlay>
    );
}
