import { Box, BoxProps, Heading, Octicon } from "@primer/react";
import Card from "../card";
import React, { ElementType } from "react";

interface IIndicatorProps extends BoxProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    leadingIcon?: ElementType<any>;
    header: number | string | React.ReactNode;
    description: string;
}

export default function Indicator({
    header: metric,
    description: title,
    leadingIcon,
    ...props
}: IIndicatorProps) {
    return (
        <Card.Root
            sx={{ height: "100%" }}
            {...props}
        >
            <Box>
                <Heading
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    {leadingIcon && (
                        <Octicon
                            icon={leadingIcon}
                            size={20}
                        />
                    )}
                    {metric}
                </Heading>
                {title}
            </Box>
        </Card.Root>
    );
}
