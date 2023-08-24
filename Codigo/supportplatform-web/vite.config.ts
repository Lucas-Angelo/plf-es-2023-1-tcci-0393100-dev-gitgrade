import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const envDir = path.resolve(process.cwd(), "env");
    process.env = Object.assign(process.env, loadEnv(mode, envDir, ""));
    const { PORT } = process.env;
    const port = Number(PORT) || 3000;

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
