import { Box, Octicon, Text } from "@primer/react";
import { MarkGithubIcon } from "@primer/octicons-react";

interface ISigninButtonProps {
    onClick?: () => void;
}

export default function SigninButton(props: ISigninButtonProps) {
    return (
        <Box
            onClick={props.onClick}
            sx={{
                border: "1px solid #D1D5DA",
                borderRadius: 4,
                padding: 3,
                display: "flex",
                flexDirection: ["column", "column", "row"],
                alignItems: "center",
                gap: 4,
                background: "transparent",
                cursor: "pointer",
                color: "white",
                transition: "background 0.2s, border-color 0.2s, color 0.2s",
                ":hover": {
                    background: "white",
                    borderColor: "white",
                    color: "#2F363D",
                },
            }}
            as="button"
        >
            <Octicon
                icon={MarkGithubIcon}
                size={40}
            />
            <Text
                sx={{
                    fontSize: [3, 4, 5],
                    fontWeight: "bold",
                }}
            >
                Entrar com seu GitHub
            </Text>
        </Box>
    );
}
