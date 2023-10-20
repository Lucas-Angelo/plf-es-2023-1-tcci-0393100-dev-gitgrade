import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRouter from "./setup/routes/index.tsx";
import { ThemeProvider } from "@primer/react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./commom/data/client/index.tsx";
import ModalProvider from "./commom/context/modal/index.tsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <ModalProvider>
                    <AppRouter />
                    <ToastContainer theme="colored" />
                </ModalProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>
);
