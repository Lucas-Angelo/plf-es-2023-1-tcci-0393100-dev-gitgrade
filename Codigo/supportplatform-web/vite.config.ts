import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const envDir = path.resolve(process.cwd(), "env");
    process.env = Object.assign(process.env, loadEnv(mode, envDir, ""));
    const { VITE_PORT } = process.env;
    const port = Number(VITE_PORT) || 3000;

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
        },
    };
});
