import { Box } from "@primer/react";

interface ICardTitleProps {
    children?: React.ReactNode;
}
export default function CardTitle(props: ICardTitleProps) {
    return <Box sx={{ flexGrow: 1 }}>{props.children}</Box>;
}
