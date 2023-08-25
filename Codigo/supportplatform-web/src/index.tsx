import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRouter from "./setup/routes/index.tsx";
import { ThemeProvider } from "@primer/react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./commom/data/client/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AppRouter />
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>
);
