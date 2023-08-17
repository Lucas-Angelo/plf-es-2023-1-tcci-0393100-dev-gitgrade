import { Box } from "@primer/react";

export interface ICardRootProps {
    children?: React.ReactNode;
}

export default function CardRoot(props: ICardRootProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: ["column", "column", "row"],
                width: "100%",
                paddingY: 3,
                paddingX: 5,
                gap: [2, 2, 4],
                alignItems: ["flex-start", "flex-start", "center"],
                borderRadius: 4,
                backgroundColor: "canvas.subtle",
            }}
        >
            {props.children}
        </Box>
    );
}
