import { Details, DetailsProps, useDetails, Box, Octicon } from "@primer/react";
import { ChevronRightIcon, ChevronDownIcon } from "@primer/octicons-react";

interface INoContributorDetailsProps {
    sx?: DetailsProps["sx"];
}

export default function NoContributorDetails(
    props: INoContributorDetailsProps
) {
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
                Porque há o grupo &quot;(Sem contribuidor)&quot;?
            </Box>
            Isso acontece porque a API do GitHub não forneceu nenhum
            contribuidor para alguns commits. Isso pode acontecer por dois
            motivos:
            <Box
                as="ul"
                sx={{ pl: 4, pt: 0 }}
            >
                <Box as="li">
                    O commit realizado localmente foi feito sem informações de
                    autoria.
                </Box>
                <Box as="li">
                    O commit foi co-autorado, e o GitHub não fornece o autor nem
                    os co-autores.
                </Box>
            </Box>
        </Details>
    );
}
