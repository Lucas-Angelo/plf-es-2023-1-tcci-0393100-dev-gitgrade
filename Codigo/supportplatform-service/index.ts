import app from "./src";
import EnvConfig from "./src/config/EnvConfig";
import logger from "./src/config/LogConfig";
import Database from "./src/database";

const database = new Database();
database.connect().catch(database.disconnect);

const port = EnvConfig.PORT || 3001;
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
