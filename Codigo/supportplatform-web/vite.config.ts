/* eslint-disable */
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const envDir = path.resolve(process.cwd(), "env");
    const loadedEnv = loadEnv(mode, envDir, "") as Record<string, string>;
    process.env = Object.assign(process.env, loadedEnv);
    const PORT = process.env.PORT as string;
    const port = Number(PORT) || 3000;
    const HOST = process.env.SUPPORTPLATFORM_WEB_HOST as string;
    const host = HOST || "0.0.0.0";

    return {
        plugins: [
            react(),
            checker({
                typescript: {
                    tsconfigPath: "./tsconfig.json",
                },
                eslint: {
                    lintCommand: "eslint . --ext ts,tsx",
                },
            }),
        ],
        envDir: "./env",
        server: {
            port,
            host,
        },
    };
});
