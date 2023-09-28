import { Box, Avatar, Text } from "@primer/react";

import GitGradeLogoPng from "../../assets/logo.png";
import SigninButton from "./components/signinButton";

export default function LoginPage() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                gap: 4,
                background:
                    "radial-gradient(circle, rgba(36,41,46,1) 0%, rgba(44,51,57,1) 85%, rgba(55,70,85,1) 100%)",
            }}
        >
            <Avatar
                src={GitGradeLogoPng}
                size={80}
            />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: "#2F363D",
                    borderRadius: 4,
                    mx: 3,
                    mb: 3,
                    padding: 7,
                    color: "white",
                    maxWidth: "small",
                }}
            >
                <Text
                    sx={{
                        fontSize: 4,
                        fontWeight: "bold",
                        textAlign: "center",
                        lineHeight: "2",
                    }}
                >
                    Plataforma de avaliação de trabalhos interdisciplinares
                </Text>

                <SigninButton />
            </Box>
        </Box>
    );
}
