export enum CodeQualityStatusDto {
  ANALYZING = "ANALYZING",
  ANALYZED = "ANALYZED",
  ERROR = "ERROR",
}

/**
 * CodeQualityResponseDTO - DTO for code quality analysis response.
 */
export interface CodeQualityResponseDTO {
  id: number;
  repositoryId: number;
  path: string;
  status: CodeQualityStatusDto;
  createdAt: Date;
}
