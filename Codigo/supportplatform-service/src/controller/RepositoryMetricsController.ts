import { Get, Query, Route, Tags } from "tsoa";
import CommitService from "../service/CommitService";
import { CommitMetricsDTO } from "@gitgrade/dtos";
import { CommitMetricsMapper } from "../mapper/CommitMetricsMapper";

@Route("repository/{repositoryId}/metric")
@Tags("metrics")
export class RepositoryMetricsController {
    service: CommitService;

    constructor() {
        this.service = new CommitService();
    }

    @Get("commit")
    async getCommitMetrics(
        repositoryId: number,
        @Query() branchName?: string
    ): Promise<CommitMetricsDTO[]> {
        const serviceResponse = await this.service.getCommitMetrics(
            repositoryId,
            branchName ?? "master"
        );
        return serviceResponse.map((item) =>
            new CommitMetricsMapper().toDto(
                item,
                serviceResponse.reduce(
                    (sum, item) => sum + Number(item.commitCount),
                    0
                )
            )
        );
    }
}
