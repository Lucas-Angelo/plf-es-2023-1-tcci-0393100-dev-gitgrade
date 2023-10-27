import { CodeQualityStatusDto } from "@gitgrade/dtos/dto/codeQuality";
import AppError from "../error/AppError";

export class CodeQualityStatusMapper {
    toDto(codeQualityFromModel: string): CodeQualityStatusDto {
        if (!(codeQualityFromModel in CodeQualityStatusDto)) {
            throw new AppError(
                `Unknown code quality status: ${codeQualityFromModel}`,
                500
            );
        }
        return CodeQualityStatusDto[
            codeQualityFromModel as keyof typeof CodeQualityStatusDto
        ];
    }
}
