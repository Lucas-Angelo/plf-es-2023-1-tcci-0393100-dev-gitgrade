import app from "./src";
import EnvConfig from "./src/config/EnvConfig";
import { generateToken } from "./src/config/JwtConfig";
import logger from "./src/config/LogConfig";
import Database from "./src/database";

const database = new Database();
database.connect().catch(database.disconnect);

console.log(generateToken(1));

const port = EnvConfig.PORT || 3002;
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
