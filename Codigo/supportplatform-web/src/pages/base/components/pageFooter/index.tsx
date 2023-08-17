import { Avatar, Box, PageLayout, Link as PrimerLink } from "@primer/react";
import GitGradeLogoPng from "../../../../assets/logo.png";
import "./styles.css";

export default function PageFooter() {
    return (
        <PageLayout.Footer
            divider="line"
            sx={{ maxWidth: 1248 }}
            padding="normal"
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                    flexWrap: "wrap",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                        src={GitGradeLogoPng}
                        size={32}
                        sx={{ mx: 2, scale: "2.2" }}
                    />
                    © 2023 Plataforma de Apoio às Avaliações de Projetos GitHub.
                </Box>
                <PrimerLink
                    target="_blank"
                    href="https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2023-1-tcci-0393100-dev-plataformaapoioavaliacoesprojetos"
                >
                    Repositório
                </PrimerLink>
            </Box>
        </PageLayout.Footer>
    );
}
