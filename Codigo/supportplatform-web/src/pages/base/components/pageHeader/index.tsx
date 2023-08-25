import {
    Avatar,
    Header,
    TextInput,
    ActionMenu,
    ActionList,
    Box,
    Octicon,
    Truncate,
} from "@primer/react";
import { TriangleDownIcon, PlusIcon } from "@primer/octicons-react";
import { Link } from "react-router-dom";
import GitGradeLogoPng from "../../../../assets/logo.png";
import appRoutes from "../../../../commom/routes/appRoutes";
import MobileMenu from "../mobileMenu";

export default function PageHeader() {
    return (
        <Header>
            <Header.Item
                sx={{
                    display: ["flex", "flex", "none"],
                }}
            >
                <MobileMenu />
            </Header.Item>
            <Header.Item>
                <Link
                    to={appRoutes.base.link()}
                    style={{ textDecoration: "none" }}
                >
                    <Header.Link as="span">
                        <Avatar
                            src={GitGradeLogoPng}
                            size={32}
                            sx={{ scale: "1.3" }}
                        />
                        <Truncate
                            sx={{ ml: 2 }}
                            inline
                            title="GitGrade"
                        >
                            GitGrade
                        </Truncate>
                    </Header.Link>
                </Link>
            </Header.Item>
            <Header.Item
                sx={{
                    display: ["none", "none", "block"],
                }}
            >
                <TextInput
                    name="search-repo"
                    placeholder="Buscar trabalho..."
                    sx={{
                        background: "none",
                        borderColor: "gray",
                        color: "white",
                    }}
                />
            </Header.Item>
            <Header.Item
                sx={{
                    display: ["none", "none", "flex"],
                }}
            >
                <Link
                    to={appRoutes.repo.link()}
                    style={{ textDecoration: "none" }}
                >
                    <Header.Link
                        as="span"
                        sx={{
                            textDecoration: "inherit",
                            fontSize: [0, 0, 12, 14],
                        }}
                    >
                        Repositórios de trabalhos
                    </Header.Link>
                </Link>
            </Header.Item>
            <Header.Item
                full
                sx={{
                    display: ["none", "none", "flex"],
                }}
            >
                <Link
                    to={appRoutes.evaluationMethod.link()}
                    style={{ textDecoration: "none" }}
                >
                    <Header.Link
                        as="span"
                        sx={{
                            fontSize: [0, 0, 12, 14],
                        }}
                    >
                        Métodos avaliativos
                    </Header.Link>
                </Link>
            </Header.Item>
            <Header.Item
                sx={{ mr: 2, display: "flex", justifyContent: "flex-end" }}
                full
            >
                <ActionMenu>
                    <ActionMenu.Anchor>
                        <Box
                            sx={{
                                ":hover": {
                                    bg: "gray",
                                },
                                p: 1,
                                borderRadius: 4,
                            }}
                        >
                            <Octicon icon={PlusIcon} />
                            <Octicon icon={TriangleDownIcon} />
                        </Box>
                    </ActionMenu.Anchor>

                    <ActionMenu.Overlay>
                        <ActionList>
                            <ActionList.Item
                                sx={{ color: "grayText" }}
                                onSelect={() => console.log("Em breve")}
                            >
                                Em breve...
                            </ActionList.Item>
                        </ActionList>
                    </ActionMenu.Overlay>
                </ActionMenu>
            </Header.Item>
            <Header.Item sx={{ mr: 0 }}>
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

                    <ActionMenu.Overlay>
                        <ActionList>
                            <ActionList.Item
                                sx={{ color: "grayText" }}
                                onSelect={() => console.log("Em breve")}
                            >
                                Em breve...
                            </ActionList.Item>
                        </ActionList>
                    </ActionMenu.Overlay>
                </ActionMenu>
            </Header.Item>
        </Header>
    );
}
