import fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import path from "path";
import TransportStream from "winston-transport";

interface LogInfo {
    level: string;
    message: string;
    timestamp: string;
    [key: string]: unknown;
}

interface TelegramFileTransportOptions {
    level?: string;
    chatId: string;
    token: string;
}

export class TelegramFileTransport extends TransportStream {
    private chatId: string;
    private bot: TelegramBot;
    private messageQueue: Array<{ message: string; filePath?: string }>;
    private isSending: boolean;

    constructor(options: TelegramFileTransportOptions) {
        super({ level: options.level || "error" });
        this.chatId = options.chatId;
        this.bot = new TelegramBot(options.token, { polling: false });
        this.messageQueue = [];
        this.isSending = false;
        this.ensureLogsDirectoryExists(); // Move logs directory creation to the constructor
        // Call the function to delete the old log files at application startup
        this.deleteTelegramLogFiles();
    }

    private deleteTelegramLogFiles(): void {
        const logsDirPath = path.join(path.resolve("."), "logs");
        if (fs.existsSync(logsDirPath)) {
            const logFiles = fs.readdirSync(logsDirPath);
            logFiles.forEach((file) => {
                if (file.startsWith("telegram_log_")) {
                    const filePath = path.join(logsDirPath, file);
                    try {
                        fs.unlinkSync(filePath);
                        console.log("Deleted log file:", filePath);
                    } catch (err) {
                        console.error("Error deleting log file:", err);
                    }
                }
            });
        }
    }

    private generateUniqueFileName(level: string): string {
        const date = new Date();
        const timestamp = date.getTime(); // Use the timestamp as part of the file name
        const randomString = Math.random().toString(36).substring(2, 5); // Add a random string to make the file name unique
        return `telegram_log_${level}_${timestamp}_${randomString}.txt`;
    }

    private ensureLogsDirectoryExists(): void {
        const logsDirPath = path.join(path.resolve("."), "logs");
        if (!fs.existsSync(logsDirPath)) {
            fs.mkdirSync(logsDirPath);
        }
    }

    private async sendNextMessageInQueue(): Promise<void> {
        if (this.isSending || this.messageQueue.length === 0) {
            return; // No need to wrap this with Promise.resolve()
        }

        this.isSending = true;
        const { message, filePath } = this.messageQueue.shift()!;

        if (filePath) {
            try {
                await this.bot.sendDocument(
                    this.chatId,
                    filePath,
                    {
                        caption: message,
                    },
                    { contentType: "text/plain" }
                );
                console.log("File sent successfully. Deleting:", filePath);
                fs.unlinkSync(filePath);
            } catch (error) {
                console.error("Error sending document:", error);
            } finally {
                this.isSending = false;
                await this.sendNextMessageInQueue(); // Use async/await directly instead of returning the promise
            }
        } else {
            this.isSending = false;
            await this.sendNextMessageInQueue();
        }
    }

    log(info: LogInfo, callback: () => void) {
        setImmediate(() => {
            this.emit("logged", info);
        });

        const { level } = info;

        const formattedMessage = this.formatMessage(info);
        const maxMessageCaptionLength = 1024;

        if (formattedMessage.length > maxMessageCaptionLength) {
            const truncatedMessage = formattedMessage.substring(
                0,
                maxMessageCaptionLength
            );
            const filePath = this.saveLogToFile(level, formattedMessage);
            this.messageQueue.push({ message: truncatedMessage, filePath });
        } else {
            callback(); // Call the callback immediately if the message fits within the limit
            const filePath = this.saveLogToFile(level, formattedMessage);
            this.messageQueue.push({ message: formattedMessage, filePath });
        }

        this.sendNextMessageInQueue();
    }

    formatMessage(info: LogInfo): string {
        const date = new Date();
        const timestamp = date.toISOString(); // Use ISO string for standardized timestamp

        const { level, message, ...rest } = info;
        let formattedMessage = `[${level.toUpperCase()}] ${timestamp} - ${message}\n`;

        for (const key in rest) {
            try {
                formattedMessage += `_${key}:_ \`\`\`${JSON.stringify(
                    rest[key],
                    null,
                    2
                )}\`\`\`\n`;
            } catch (err) {
                formattedMessage += `_${key}:_ ${rest[key]}\n`;
            }
        }

        return formattedMessage;
    }

    private saveLogToFile(level: string, message: string): string {
        const fileName = this.generateUniqueFileName(level);
        const filePath = path.join(path.resolve("."), "logs", fileName);
        fs.writeFileSync(filePath, message, "utf8");
        return filePath;
    }
}
