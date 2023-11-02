import { CodeQualityStatus } from "@gitgrade/dtos/dto/codeQuality";
import AppError from "../error/AppError";

export class CodeQualityStatusMapper {
    toDto(codeQualityFromModel: string): CodeQualityStatus {
        if (!(codeQualityFromModel in CodeQualityStatus)) {
            throw new AppError(
                `Unknown code quality status: ${codeQualityFromModel}`,
                500
            );
        }
        return CodeQualityStatus[
            codeQualityFromModel as keyof typeof CodeQualityStatus
        ];
    }
}
