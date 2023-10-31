import {
    BranchDTO,
    GetAllBranchQueryDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import api from "../config/api";
import { BranchPatchDTO } from "@gitgrade/dtos/dto/branch";

export class BranchService {
    getByRepositoryId(id: number, queryDto?: GetAllBranchQueryDTO) {
        const searchParams = new URLSearchParams();

        if (queryDto?.page) searchParams.set("page", queryDto.page.toString());
        if (queryDto?.limit)
            searchParams.set("limit", queryDto.limit.toString());

        return api.get<PaginationResponseDTO<BranchDTO>>(
            `repository/${id}/branch`
        );
    }

    patch(repositoryId: number, branchId: number, body: BranchPatchDTO) {
        return api.patch(`repository/${repositoryId}/branch/${branchId}`, body);
    }
}
