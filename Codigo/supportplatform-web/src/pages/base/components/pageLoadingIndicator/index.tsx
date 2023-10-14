import LinearLoading from "../../../../commom/components/linearLoading";
import { useNavigation } from "react-router";
import { Box } from "@primer/react";

export default function PageLoadingIndicator() {
    const navigation = useNavigation();

    return (
        <>
            {navigation.state === "loading" ? (
                <Box sx={{ width: "100%", position: "sticky", top: 0 }}>
                    <LinearLoading />
                </Box>
            ) : (
                <Box height={4} />
            )}
        </>
    );
}
