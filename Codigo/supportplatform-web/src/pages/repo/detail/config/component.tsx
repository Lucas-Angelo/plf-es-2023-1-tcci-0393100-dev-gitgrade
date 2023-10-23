import { ToggleSwitch, Box } from "@primer/react";

export default function RepositoryConfigPage() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
            }}
            className="toggle-switch-wrapper"
        >
            Sincronização automática
            <ToggleSwitch aria-labelledby="Sincronização automática" />
        </Box>
    );
}
