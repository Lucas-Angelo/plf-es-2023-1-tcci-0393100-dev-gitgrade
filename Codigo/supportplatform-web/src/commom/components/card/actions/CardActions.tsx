import { Box } from "@primer/react";

interface ICardActionsProps {
    children?: React.ReactNode;
}
export default function CardActions(props: ICardActionsProps) {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                width: ["100%", "100%", "auto"],
                flexWrap: "wrap",
            }}
        >
            {props.children}
        </Box>
    );
}
