import Card from "../../../../../../commom/components/card";
import { Avatar, Box, Button, RelativeTime } from "@primer/react";
import AvatarFallbackLogoImage from "../../../../../../assets/avatar-fallback-logo.png";
import QuestionMarkImage from "../../../../../../assets/question-mark.png";

interface ICommitCardProps {
    message: string | undefined | null;
    commitedDate: Date;
    contributor?: {
        githubLogin: string | null;
        githubAvatarUrl: string | null;
        githubName?: string | null;
    };
    sha: string;

    isFirst?: boolean;
    isLast?: boolean;

    repoName: string;

    onAvatarClick?: (githubLogin: string | null) => void;
}

export default function CommitCard(props: ICommitCardProps) {
    return (
        <Card.Root
            sx={{
                borderLeft: "1px solid lightgray",
                borderRight: "1px solid lightgray",
                borderBottom: "1px solid lightgray",
                borderTop: props.isFirst ? "1px solid lightgray" : "none",
                borderTopLeftRadius: props.isFirst ? "4px" : "0",
                borderTopRightRadius: props.isFirst ? "4px" : "0",
                borderBottomLeftRadius: props.isLast ? "4px" : "0",
                borderBottomRightRadius: props.isLast ? "4px" : "0",
                px: 3,
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
                >
                    {props.message}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",

                        ...(props.onAvatarClick && {
                            border: "none",
                            backgroundColor: "transparent",
                            p: 0,
                            cursor: "pointer",
                            transition: "opacity .2s",
                            ":hover": {
                                opacity: 0.7,
                            },
                        }),
                    }}
                    as={props.onAvatarClick ? "button" : "div"}
                    onClick={() =>
                        props.onAvatarClick?.(
                            props.contributor?.githubLogin ?? null
                        )
                    }
                >
                    <Avatar
                        src={
                            props.contributor
                                ? props.contributor?.githubAvatarUrl ??
                                  AvatarFallbackLogoImage
                                : QuestionMarkImage
                        }
                        alt={props.contributor?.githubLogin ?? ""}
                        size={20}
                    />
                    <Box
                        sx={{
                            fontSize: 1,
                            fontWeight: "bold",
                            color: "black",
                        }}
                    >
                        {props.contributor
                            ? props.contributor?.githubName ??
                              props.contributor?.githubLogin ??
                              "Desconhecido"
                            : "Sem contribuidor"}
                    </Box>
                    <Box
                        sx={{
                            fontSize: 1,
                        }}
                    >
                        <RelativeTime
                            format="relative"
                            date={new Date(props.commitedDate)}
                            lang="pt-BR"
                        />
                    </Box>
                </Box>
            </Card.Title>
            <Card.Actions>
                <Button
                    as="a"
                    href={`https://github.com/ICEI-PUC-Minas-PPLES-TI/${props.repoName}/commit/${props.sha}`}
                    variant="outline"
                    title={props.sha}
                    target="_blank"
                >
                    # {props.sha.substring(0, 7)}
                </Button>
            </Card.Actions>
        </Card.Root>
    );
}
