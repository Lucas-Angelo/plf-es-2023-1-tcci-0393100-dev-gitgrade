import { Box } from "@primer/react";
import React, { useRef } from "react";

interface IDrawerProps {
    children: React.ReactNode;
    isDrawerOpen: boolean;
    onClose(): void;
}

export default function Drawer({
    children,
    isDrawerOpen,
    onClose,
}: IDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const isOpennedRef = useRef(isDrawerOpen);
    isOpennedRef.current = isDrawerOpen;

    return (
        <>
            <Box
                onClick={() => onClose()}
                sx={{
                    display: isDrawerOpen ? "block" : "none",
                    position: "fixed",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo preto com média opacidade
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}
            ></Box>
            <Box
                ref={drawerRef}
                sx={{
                    position: "fixed",
                    top: 0,
                    left: isDrawerOpen ? 0 : "-250px", // Slide para fora da tela quando fechado
                    bottom: 0,
                    width: "250px",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    overflowY: "auto",
                    transition: "left 0.2s ease-in-out", // Adiciona animação de slide
                }}
            >
                {children}
            </Box>
        </>
    );
}
