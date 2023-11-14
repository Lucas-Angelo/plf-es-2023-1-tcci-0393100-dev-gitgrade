import { Avatar, AvatarStack, Box, IconButton } from "@primer/react";
import Card from "../../../../../../commom/components/card";
import AvatarFallbackLogoImage from "../../../../../../assets/avatar-fallback-logo.png";
import QuestionMarkImage from "../../../../../../assets/question-mark.png";
import { fileChangeColors } from "../../../../../../commom/style/colors";
import { MarkGithubIcon } from "@primer/octicons-react";
import env from "../../../../../../commom/config/env";

interface IFileCardProps {
    path: string;
    contributors?: Array<{
        id: number;
        githubLogin: string | null;
        githubAvatarUrl: string | null;
        githubName?: string | null;
    } | null>;

    additions: number;
    deletions: number;

    onAvatarClick?: (githubLogin: string | null) => void;

    repoName: string;
    branchName: string;
}

export default function FileCard(props: IFileCardProps) {
    return (
        <Card.Root
            sx={{
                border: "1px solid lightgray",
                py: 2,
                px: 4,
            }}
        >
            <Card.Title>
                <Box
                    className="one-line-truncate"
                    sx={{
                        fontSize: 1,
                        fontWeight: "bold",
                        color: "black",
                    }}
                    title={props.path}
                >
                    {props.path}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    {props.contributors?.length !== 0 && (
                        <AvatarStack>
                            {props.contributors?.map((contributor) => (
                                <Avatar
                                    tabIndex={props.onAvatarClick ? 0 : -1}
                                    onClick={() =>
                                        props.onAvatarClick?.(
                                            contributor?.githubLogin ?? null
                                        )
                                    }
                                    src={
                                        contributor
                                            ? contributor?.githubAvatarUrl ??
                                              AvatarFallbackLogoImage
                                            : QuestionMarkImage
                                    }
                                    alt={
                                        contributor
                                            ? contributor?.githubLogin ??
                                              "Desconhecido"
                                            : "Sem contribuidor"
                                    }
                                    title={
                                        contributor
                                            ? contributor?.githubLogin ??
                                              "Desconhecido"
                                            : "Sem contribuidor"
                                    }
                                    size={20}
                                    key={contributor?.id ?? -1}
                                    sx={{
                                        cursor: props.onAvatarClick
                                            ? "pointer"
                                            : "default",
                                    }}
                                />
                            ))}
                        </AvatarStack>
                    )}
                    <Box
                        sx={{
                            color: fileChangeColors.additions,
                        }}
                    >
                        + {props.additions}
                    </Box>
                    <Box
                        sx={{
                            color: fileChangeColors.deletions,
                        }}
                    >
                        - {props.deletions}
                    </Box>
                </Box>
            </Card.Title>
            <Card.Actions>
                <IconButton
                    as="a"
                    href={`https://github.com/${env.githubOrganizationName}/${props.repoName}/blob/${props.branchName}/${props.path}`}
                    variant="outline"
                    title={props.path}
                    target="_blank"
                    icon={MarkGithubIcon}
                    aria-labelledby="github-file-link"
                />
            </Card.Actions>
        </Card.Root>
    );
}
