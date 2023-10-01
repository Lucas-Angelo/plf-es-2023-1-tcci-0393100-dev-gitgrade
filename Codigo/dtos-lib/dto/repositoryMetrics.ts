export interface RepositoryMetricQueryDTO {
    /** @isDate startedAt must be a valid date  */
    startedAt?: Date,
    /** @isDate endedAt must be a valid date */
    endedAt?: Date,
    branchName?: string,
    contributor?: Array<string>,
    filterWithNoContributor?: boolean
}