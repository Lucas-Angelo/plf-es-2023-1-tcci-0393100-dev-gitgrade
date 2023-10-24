import {
    // FileResponseDTO,
    FileSearchDTO,
    PaginationResponseDTO,
} from "@gitgrade/dtos";
import {
    Controller,
    // Example,
    Get,
    Queries,
    Route,
    Security,
    SuccessResponse,
    Tags,
} from "tsoa";
import { FileMapper } from "../mapper/FileMapper";
import FileService from "../service/FileService";

@Route("file")
@Security("bearer", ["admin"])
@Tags("file")
export class FileController extends Controller {
    private fileService: FileService;
    private fileMapper: FileMapper;

    constructor() {
        super();
        this.fileService = new FileService();
        this.fileMapper = new FileMapper();
    }

    /**
     * Get all Files with pagination and filter.
     * Can filter by start_date, end_date, and evaluationMethodId.
     * @query query FileSearchDTO query to filter by start_date, end_date, and evaluationMethodId.
     */
    // @Example<PaginationResponseDTO<FileResponseDTO>>({
    //     totalPages: 1,
    //     results: [
    //         {
    //             id: 1,
    //             message: "File 1",
    //             filetedDate: new Date("2023-01-01"),
    //             branch: {
    //                 id: 1,
    //                 name: "master",
    //             },
    //             sha: "1234567890",
    //             contributor: {
    //                 id: 1,
    //                 githubAvatarUrl:
    //                     "https://avatars.githubusercontent.com/u/1?v=4",
    //                 githubLogin: "octocat",
    //                 githubEmail: "pessoa@email.com",
    //                 githubName: "Octo Cat",
    //             },
    //         },
    //     ],
    // })
    @Get("/")
    @SuccessResponse("200", "Found files")
    public async getAll(
        @Queries() query: FileSearchDTO
    ): Promise<PaginationResponseDTO<{ path: string }>> {
        this.setStatus(200);
        const serviceResponse = await this.fileService.findAll(query);
        return {
            totalPages: serviceResponse.totalPages,
            results: serviceResponse.results.map(this.fileMapper.toDto),
        };
    }
}
