import { ActionMenu, ActionList, Box, Octicon, Avatar } from "@primer/react";
import { TriangleDownIcon, SignOutIcon } from "@primer/octicons-react";
import { cleanCookie } from "../../../../commom/utils/cookies";
import { SessionCookieName } from "../../../../commom/config/session";
import { useNavigate } from "react-router";
import appRoutes from "../../../../commom/routes/appRoutes";

export default function OptionsMenu() {
    const navigate = useNavigate();

    function handleSignOutButtonClick() {
        const tokenCookieName: SessionCookieName = "token";
        cleanCookie(tokenCookieName);

        navigate(appRoutes.login.link());
    }

    return (
        <ActionMenu>
            <ActionMenu.Anchor>
                <Box
                    sx={{
                        ":hover": {
                            bg: "gray",
                        },
                        px: 1,
                        borderRadius: 4,
                    }}
                >
                    <Avatar
                        src="https://github.com/octocat.png"
                        size={32}
                        alt="@octocat"
                    />
                    <Octicon icon={TriangleDownIcon} />
                </Box>
            </ActionMenu.Anchor>

            <ActionMenu.Overlay
                sx={{
                    mt: 3,
                }}
            >
                <ActionList>
                    <ActionList.Item
                        sx={{ color: "grayText" }}
                        onSelect={handleSignOutButtonClick}
                    >
                        <Octicon
                            icon={SignOutIcon}
                            sx={{ mr: 1 }}
                        />{" "}
                        Sair
                    </ActionList.Item>
                </ActionList>
            </ActionMenu.Overlay>
        </ActionMenu>
    );
}
