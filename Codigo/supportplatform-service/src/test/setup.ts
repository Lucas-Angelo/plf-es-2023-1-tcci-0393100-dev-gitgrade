import { exit } from "process";
import { seedDatabase } from "./database/seed";
import Database from "../database";

export default async () => {
    try {
        // eslint-disable-next-line no-console
        console.log("Preparing test database...");
        const db = new Database();
        await db.connect();
        await db.sync({ force: true });
        await seedDatabase();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log("Error during tests global setup:", error);
        exit(1);
    }
};
