import { Box, BoxProps } from "@primer/react";

interface ICardActionsProps extends BoxProps {
    children?: React.ReactNode;
}
export default function CardActions(props: ICardActionsProps) {
    return (
        <Box
            {...props}
            sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                width: ["100%", "100%", "auto"],
                flexWrap: "wrap",
                ...props.sx,
            }}
        >
            {props.children}
        </Box>
    );
}
