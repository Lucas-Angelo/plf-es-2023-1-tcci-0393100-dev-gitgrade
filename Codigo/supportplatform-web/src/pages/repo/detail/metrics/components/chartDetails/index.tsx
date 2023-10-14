import React from "react";
import { Details, DetailsProps, useDetails, Box, Octicon } from "@primer/react";
import { ChevronRightIcon, ChevronDownIcon } from "@primer/octicons-react";

interface IChartDetailsProps {
    children: React.ReactNode;
    sx?: DetailsProps["sx"];
}

export default function ChartDetails(props: IChartDetailsProps) {
    const { getDetailsProps, open } = useDetails({});
    return (
        <Details
            {...getDetailsProps()}
            sx={props.sx}
        >
            <Box as="summary">
                <Octicon
                    icon={open ? ChevronDownIcon : ChevronRightIcon}
                    sx={{ mr: 2 }}
                />
                O que esse gráfico representa?
            </Box>
            {props.children}
        </Details>
    );
}
