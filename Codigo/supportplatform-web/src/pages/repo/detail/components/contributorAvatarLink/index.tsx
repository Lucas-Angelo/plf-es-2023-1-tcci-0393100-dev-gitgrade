import { Avatar, Box } from "@primer/react";
import { useSearchParams } from "react-router-dom";

interface IContributorAvatarLinkProps {
    githubName?: string | null;
    githubLogin: string | null;
    githubAvatarUrl: string | null;
}

export default function ContributorAvatarLink(
    props: IContributorAvatarLinkProps
) {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedContributors = searchParams.getAll("contributor");
    const isSelected = selectedContributors.includes(props.githubLogin!);
    const isNotFiltered = selectedContributors.length > 0 && !isSelected;

    function handleContributorClick() {
        let newContributorsFilter = selectedContributors;
        if (isSelected) {
            newContributorsFilter = selectedContributors.filter(
                (contributor) => contributor !== props.githubLogin
            );
        } else {
            newContributorsFilter = [
                ...selectedContributors,
                props.githubLogin!,
            ];
        }
        setSearchParams((searchParams) => ({
            ...searchParams,
            contributor: newContributorsFilter,
        }));
    }

    return (
        <Box
            onClick={handleContributorClick}
            as="button"
            sx={{
                border: "none",
                backgroundColor: "transparent",
                p: 0,
                cursor: "pointer",
            }}
        >
            <Avatar
                src={props.githubAvatarUrl!}
                key={props.githubLogin}
                size={20}
                title={(props.githubName || props.githubLogin) ?? "Sem nome"}
                sx={{
                    transition: "padding .4s, opacity .4s",
                    ...(isNotFiltered && {
                        opacity: 0.5,
                    }),
                    ...(isSelected && {
                        border: "2px solid",
                        borderColor: "Highlight",
                    }),
                    ":hover": {
                        p: "1px",
                    },
                }}
            />
        </Box>
    );
}
