import Ajv from "ajv";
import { YAMLException, load } from "js-yaml";
import logger from "../../config/LogConfig";
import cffScheme from "./CffScheme";

function validateCitationFile(fileContent: string) {
    try {
        const decodedContent = Buffer.from(fileContent, "base64").toString(
            "utf-8"
        );
        const dataObject = load(decodedContent);

        const ajv = new Ajv();
        const validate = ajv.compile(cffScheme);
        const valid = validate(dataObject);
        if (!valid) {
            logger.error("CITATION.cff validation errors:", {
                errors: validate.errors,
            });
            return false;
        }
        return true;
    } catch (error) {
        if (error instanceof YAMLException) {
            logger.error(
                "Invalid YAML format in CITATION.cff: " + error.message
            );
        } else {
            logger.error("Error validating CITATION.cff:", {
                error: JSON.stringify(error),
            });
            console.error(error);
        }
        return false;
    }
}

export default validateCitationFile;
