/* eslint-disable node/prefer-promises/fs */
import TelegramBot from "node-telegram-bot-api";
import TransportStream from "winston-transport";

interface LogInfo {
    level: string;
    message: string;
    timestamp: string;
    [key: string]: unknown;
}

interface TelegramTransportOptions {
    level?: string;
    chatId: string;
    token: string;
}

export class TelegramTransport extends TransportStream {
    private chatId: string;
    private bot: TelegramBot;

    constructor(options: TelegramTransportOptions) {
        super({ level: options.level || "error" });
        this.chatId = options.chatId;
        this.bot = new TelegramBot(options.token, { polling: false });
    }

    async log(info: LogInfo, callback: () => void) {
        setImmediate(() => {
            this.emit("logged", info);
        });

        const formattedMessage = this.formatMessage(info);

        try {
            await this.bot.sendMessage(this.chatId, formattedMessage, {
                parse_mode: "Markdown",
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }

        callback();
    }

    formatMessage(info: LogInfo): string {
        const date = new Date();
        const timestamp = date.toISOString();

        const { level, message, ...rest } = info;
        let formattedMessage = `*[${level.toUpperCase()}] ${timestamp} - ${message}*\n`;

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
}
