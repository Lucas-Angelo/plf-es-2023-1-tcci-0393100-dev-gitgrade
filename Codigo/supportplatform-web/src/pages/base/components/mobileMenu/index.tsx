import { IconButton, ActionList, Box } from "@primer/react";
import { ThreeBarsIcon, XIcon } from "@primer/octicons-react";
import { useState } from "react";
import Drawer from "../../../../commom/components/drawer";
import appRoutes from "../../../../commom/routes/appRoutes";
import { Link } from "react-router-dom";

export default function MobileMenu() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <Box>
            <IconButton
                aria-labelledby="abrir menu"
                icon={ThreeBarsIcon}
                onClick={toggleDrawer}
                variant="invisible"
                as="button"
            />
            <Drawer
                isDrawerOpen={isDrawerOpen}
                onClose={toggleDrawer}
            >
                <Box sx={{ display: isDrawerOpen ? "block" : "none" }}>
                    <ActionList>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                m: 2,
                            }}
                        >
                            <IconButton
                                aria-labelledby="fechar menu"
                                icon={XIcon}
                                onClick={toggleDrawer}
                                variant="invisible"
                                as="button"
                            />
                        </Box>
                        <Link
                            to={appRoutes.evaluationMethod.link()}
                            style={{ textDecoration: "none" }}
                        >
                            <ActionList.Item
                                tabIndex={-1}
                                sx={{ color: "grayText" }}
                            >
                                Métodos avaliativos
                            </ActionList.Item>
                        </Link>
                        <Link
                            to={appRoutes.repo.link()}
                            style={{ textDecoration: "none" }}
                        >
                            <ActionList.Item
                                tabIndex={-1}
                                sx={{ color: "grayText" }}
                            >
                                Repositórios de trabalhos
                            </ActionList.Item>
                        </Link>
                    </ActionList>
                </Box>
            </Drawer>
        </Box>
    );
}
