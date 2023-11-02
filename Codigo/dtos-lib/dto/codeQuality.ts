export enum CodeQualityStatus {
  ANALYZING = "ANALYZING",
  ANALYZED = "ANALYZED",
  ERROR = "ERROR",
}

export interface CodeQualitySearchDTO {
  /**
   * @isOptional page is optional, if not provided, default to 1
   * @isInt page must be an integer
   * @minimum 1 page must be greater than or equal to 1
   * @default 1
   */
  page?: number;
  /**
   * @isOptional limit is optional, if not provided, default to 10
   * @isInt limit must be an integer
   * @minimum 1 limit must be greater than or equal to 1
   * @default 10
   */
  limit?: number;
  /**
   * @isOptional description is optional
   * @isInt repositoryId must be an integer
   * @minimum 1 repositoryId must be greater than or equal to 1
   */
  repositoryId?: number;
  /**
   * @isOptional description is optional
   * @isString url must be a string
   */
  url?: string;
  /**
   * @isOptional description is optional
   * @isEnum status must be one of ['ANALYZING', 'ANALYZED', 'ERROR']
   */
  status?: CodeQualityStatus;
  /**
   * @isOptional description is optional
   * @isDate createdAt must be a Date
   */
  createdAt?: Date;
}

/**
 * CodeQualityResponseDTO - DTO for code quality analysis response.
 */
export interface CodeQualityResponseDTO {
  id: number;
  repositoryId: number;
  url: string;
  status: CodeQualityStatus;
  createdAt: Date;
}
