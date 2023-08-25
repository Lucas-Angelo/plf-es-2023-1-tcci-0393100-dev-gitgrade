import { exit } from "process";
import MySqlDatabase from "../database/MySqlDatabase";

export default async () => {
    try {
        // eslint-disable-next-line no-console
        console.log("Dropping test database...");
        await MySqlDatabase.dropDatabase();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log("Error during tests global setup:", error);
        exit(1);
    }
};
