import { createLogger, format, Logger, transports } from "winston";
import EnvConfig from "./EnvConfig";

class AppLogger {
    private fileTransport = new transports.File({
        format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.errors({ stack: true }),
            format.splat(),
            format.printf(({ timestamp, level, message, ...rest }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message} ${
                    Object.keys(rest).length
                        ? JSON.stringify(rest, null, 2)
                        : ""
                }`;
            })
        ),
        filename: "logs/app.log",
        maxsize: 1024 * 1024 * 10, // 10 MB
        maxFiles: 5, // 5 weeks
    });

    private consoleTransport = new transports.Console({
        format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.errors({ stack: true }),
            format.splat(),
            format.printf(({ timestamp, level, message, ...rest }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message} ${
                    Object.keys(rest).length
                        ? JSON.stringify(rest, null, 2)
                        : ""
                }`;
            }),
            format.colorize({ all: true })
        ),
    });

    public getLogger(): Logger {
        const logLevel: string = EnvConfig.APP_DEBUG ? "debug" : "error"; // debug, info, warn, error

        return createLogger({
            level: logLevel,
            transports: [this.fileTransport, this.consoleTransport],
        });
    }
}

const logger: Logger = new AppLogger().getLogger();

export default logger;
