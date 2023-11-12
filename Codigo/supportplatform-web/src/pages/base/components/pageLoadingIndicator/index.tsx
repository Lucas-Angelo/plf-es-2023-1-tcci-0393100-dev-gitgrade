import LinearLoading from "../../../../commom/components/linearLoading";
import { useNavigation } from "react-router";
import { Box, Spinner } from "@primer/react";

export default function PageLoadingIndicator() {
    const navigation = useNavigation();

    return (
        <>
            {navigation.state === "loading" ? (
                <>
                    <Box sx={{ width: "100%", position: "sticky", top: 0 }}>
                        <LinearLoading />
                    </Box>
                    <Box
                        sx={{
                            position: "fixed",
                            top: 3,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            zIndex: 40,
                        }}
                    >
                        <Box
                            sx={{
                                padding: 2,
                                borderRadius: 12,
                                backgroundColor: "white",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0.8,
                            }}
                        >
                            <Spinner size="small" />
                        </Box>
                    </Box>
                </>
            ) : (
                <Box height={4} />
            )}
        </>
    );
}
