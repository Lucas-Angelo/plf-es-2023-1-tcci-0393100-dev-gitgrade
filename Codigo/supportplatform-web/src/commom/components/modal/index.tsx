import { Box, Dialog } from "@primer/react";
import React from "react";

export interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
    "aria-label"?: string;
    children?: React.ReactNode;
    header?: React.ReactNode;
}
export default function Modal(props: IModalProps) {
    return (
        <Dialog
            isOpen={props.isOpen}
            onDismiss={() => props.onClose()}
            aria-label={props["aria-label"] ?? "Modal"}
            sx={{
                color: "black",
            }}
        >
            <Dialog.Header>{props.header}</Dialog.Header>
            <Box sx={{ p: 3 }}>{props.children}</Box>
        </Dialog>
    );
}
