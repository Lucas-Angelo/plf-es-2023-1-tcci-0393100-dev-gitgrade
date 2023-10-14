import { Box } from "@primer/react";

export default function Divider() {
    return (
        <Box
            sx={{
                height: 1,
                width: "100%",
                bg: "border.default",
                my: 3,
            }}
        />
    );
}
