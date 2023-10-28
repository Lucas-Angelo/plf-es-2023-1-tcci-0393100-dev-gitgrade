import { Box, Button } from "@primer/react";
import Modal from "../modal";

interface IAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onCancel: () => void;
    "aria-label"?: string;
    header?: React.ReactNode;
    children: React.ReactNode;
}

export default function AlertModal({
    isOpen,
    onClose,
    onConfirm,
    onCancel,
    "aria-label": ariaLabel,
    header,
    children,
}: IAlertModalProps) {
    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
            aria-label={ariaLabel ?? "Confirm action"}
            header={header}
        >
            {children}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 5,
                    gap: 2,
                    alignItems: "center",
                }}
            >
                <Button
                    onClick={onCancel}
                    variant="danger"
                >
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={onConfirm}
                >
                    Confirmar
                </Button>
            </Box>
        </Modal>
    );
}
