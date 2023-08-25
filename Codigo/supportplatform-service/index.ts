import EnvConfig from "./src/config/EnvConfig";
import Database from "./src/database";
import app from "./src";

const database = new Database();
database.connect().catch(database.disconnect);

const port = EnvConfig.PORT || 3001;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${port}`);
});
