import {
    ContributorDTO,
    GetAllContributorQueryDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import api from "../config/api";

export class ContributorService {
    getByRepositoryId(id: number, queryDto?: GetAllContributorQueryDTO) {
        const searchParams = new URLSearchParams();

        if (queryDto?.page) searchParams.set("page", queryDto.page.toString());
        if (queryDto?.limit)
            searchParams.set("limit", queryDto.limit.toString());

        return api.get<PaginationResponseDTO<ContributorDTO>>(
            `repository/${id}/contributor`
        );
    }
}
