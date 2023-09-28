import { Box, Avatar, Text } from "@primer/react";

import GitGradeLogoPng from "../../assets/logo.png";
import SigninButton from "./components/signinButton";
import { LoginService } from "../../commom/service/api/login";
import appRoutes from "../../commom/routes/appRoutes";
import { useSearchParams } from "react-router-dom";

const pageSearchParams = appRoutes.login.search;

export default function LoginPage() {
    function handleSigninButtonClick() {
        new LoginService().redirectToGithubAuth();
    }

    const [searchParams] = useSearchParams();
    const message = searchParams.get(pageSearchParams.message);

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

                <SigninButton onClick={handleSigninButtonClick} />

                {message && (
                    <Text
                        sx={{
                            fontSize: 2,
                            textAlign: "center",
                            color: "#ff6a69",
                        }}
                    >
                        {message}
                    </Text>
                )}
            </Box>
        </Box>
    );
}
