import { FileResponseDTO } from "@gitgrade/dtos";
import { FileFindAllServiceResponse } from "../interface/File";
import ContributorMapper from "./ContributorMapper";

export class FileMapper {
    toDto(model: FileFindAllServiceResponse): FileResponseDTO {
        return {
            path: model.path,
            extension: model.extension,
            additions: model.additions,
            deletions: model.deletions,
            contributors: model.contributors?.map((contributor) => {
                if (!contributor) {
                    return null;
                }

                return new ContributorMapper().toDto(contributor);
            }),
        };
    }
}
