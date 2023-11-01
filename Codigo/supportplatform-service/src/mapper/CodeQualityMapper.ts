import { CodeQualityResponseDTO } from "@gitgrade/dtos";
import { CodeQuality } from "../model/CodeQuality";
import { CodeQualityStatusMapper } from "./CodeQualityStatusMapper";

export class CodeQualityMapper {
    private codeQualityStatusMapper: CodeQualityStatusMapper;

    constructor() {
        this.codeQualityStatusMapper = new CodeQualityStatusMapper();
    }

    toDto = (model: CodeQuality): CodeQualityResponseDTO => {
        return {
            id: model.id,
            repositoryId: model.repositoryId,
            url: model.url,
            status: this.codeQualityStatusMapper.toDto(model.status),
            createdAt: model.createdAt,
        };
    };
}
