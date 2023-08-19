import EnvConfig from "../../config/EnvConfig";
import logger from "../../config/LogConfig";
import { IContributorAttributes } from "../../model/Contributor";
import { Repository } from "../../model/Repository";
import {
    ContributorGitHub,
    GitHubContributorService,
    MemberGitHub,
} from "../../service/client/GitHubContributorService";
import {
    GitHubUserService,
    UserDetailsGitHub,
} from "../../service/client/GitHubUserService";
import { ContributorService } from "../../service/ContributorService";
import { RepositoryHasContributorService } from "../../service/RepositoryHasContributorService";
import { RepositoryService } from "../../service/RepositoryService";
import FetchUtil from "../../util/FetchUtil";

class ContributorFetcher {
    private gitHubContributorService: GitHubContributorService;
    private gitHubUserService: GitHubUserService;
    private contributorService: ContributorService;
    private repositoryHasContributorService: RepositoryHasContributorService;
    private repositoryService: RepositoryService;
    private fetchUtil: FetchUtil;
    private organizationMembersCache: MemberGitHub[] = [];

    constructor() {
        this.gitHubContributorService = new GitHubContributorService();
        this.gitHubUserService = new GitHubUserService();
        this.contributorService = new ContributorService();
        this.repositoryService = new RepositoryService();
        this.repositoryHasContributorService =
            new RepositoryHasContributorService();
        this.fetchUtil = new FetchUtil();

        this.organizationMembersCache = [];
    }

    async fetchContributorsForOrgAndRepositories() {
        try {
            logger.info("Starting Contributor Fetcher...");

            this.organizationMembersCache.push(
                ...(await this.fetchAndCreateContributorsForOrganization())
            );

            // TODO: Fetch only repositories with automatic sync enabled
            const repositories: Repository[] =
                await this.repositoryService.findAllWithAutomaticSynchronizationEnable();

            for (const repository of repositories)
                try {
                    await this.fetchAndCreateContributorsForEachRepository(
                        repository
                    );
                } catch (error) {
                    logger.error(
                        "Error fetching contributors for repository:",
                        { error }
                    );
                }

            logger.info("Contributors fetched and created successfully!");
        } catch (error) {
            logger.error("Error fetching or creating contributors:", { error });
            throw error;
        }
    }

    private async fetchAndCreateContributorsForOrganization(): Promise<
        MemberGitHub[]
    > {
        try {
            logger.info(
                "Fetching and creating contributors for the organization..."
            );
            const organizationMembers: MemberGitHub[] =
                await this.gitHubContributorService.getAllOrganizationMembers();
            if (organizationMembers.length === 0)
                logger.warn("No members found for organization", {
                    organizationName:
                        EnvConfig.GITHUB_ORGANIZATION_NAME ||
                        "organization not defined",
                });

            for (const memberData of organizationMembers) {
                if (!memberData.login) {
                    logger.error("Error fetching member data, without login", {
                        memberData,
                    });
                    continue;
                }

                const userDetails = await this.fetchUserDetailsWithRetry(
                    memberData.login
                );

                let contributorAttributes: IContributorAttributes;
                try {
                    contributorAttributes =
                        this.mapContributorAttributes(userDetails);
                } catch (error) {
                    logger.error("Error mapping contributor attributes:", {
                        userDetails,
                        error,
                    });
                    continue;
                }

                await this.createOrUpdateContributorWithRetry(
                    contributorAttributes
                );
            }

            logger.info(
                "Contributors for the organization fetched and created successfully!"
            );
            return organizationMembers;
        } catch (error) {
            logger.error(
                "Error fetching or creating contributors for the organization:",
                { error }
            );
            throw error;
        }
    }

    private async fetchAndCreateContributorsForEachRepository(
        repository: Repository
    ) {
        const contributors = await this.fetchContributorsWithRetry(
            repository.name!
        );
        if (contributors.length === 0)
            logger.warn(
                `No contributors found for repository "${repository.name}"`
            );

        for (const contributorData of contributors) {
            if (!contributorData.login) {
                logger.error("Error fetching contributor data, without login", {
                    contributorData,
                });
                continue;
            }

            // Check if contributor is already added as a member of the organization
            const isOrganizationMember = this.organizationMembersCache.some(
                (member) => member.login === contributorData.login
            );

            if (!isOrganizationMember) {
                // If contributor is not a member of the organization, fetch and create the details
                const userDetails = await this.fetchUserDetailsWithRetry(
                    contributorData.login
                );
                let contributorAttributes: IContributorAttributes;
                try {
                    contributorAttributes =
                        this.mapContributorAttributes(userDetails);
                } catch (error) {
                    logger.error("Error mapping contributor attributes:", {
                        userDetails,
                        error,
                    });
                    continue;
                }

                await this.createOrUpdateContributorWithRetry(
                    contributorAttributes
                );
            }

            const contributor = await this.contributorService.findOneByField(
                "githubId",
                contributorData.id!.toString()
            );

            // Associate contributor with the repository
            await this.createAssociationWithRetry(
                repository.id!,
                contributor!.id!
            );
        }
    }

    private async fetchContributorsWithRetry(
        repositoryName: string
    ): Promise<ContributorGitHub[]> {
        return await this.fetchUtil.retry<ContributorGitHub[]>(async () => {
            return await this.gitHubContributorService.getAllRepositoriesContributors(
                repositoryName
            );
        }, `Error fetching contributors for repository "${repositoryName}"`);
    }

    private async fetchUserDetailsWithRetry(
        username: string
    ): Promise<UserDetailsGitHub> {
        return await this.fetchUtil.retry<UserDetailsGitHub>(async () => {
            return await this.gitHubUserService.getUserByUsername(username);
        }, `Error fetching user details for contributor "${username}"`);
    }

    private async createOrUpdateContributorWithRetry(
        contributorAttributes: IContributorAttributes
    ): Promise<IContributorAttributes> {
        return await this.fetchUtil.retry<IContributorAttributes>(async () => {
            return await this.contributorService.createOrUpdate(
                contributorAttributes
            );
        }, `Error creating or updating contributor "${contributorAttributes.githubLogin}"`);
    }

    private async createAssociationWithRetry(
        repositoryId: number,
        contributorId: number
    ): Promise<void> {
        return await this.fetchUtil.retry<void>(async () => {
            await this.repositoryHasContributorService.createAssociation(
                repositoryId,
                contributorId
            );
        }, `Error creating association between repository "${repositoryId}" and contributor "${contributorId}"`);
    }

    private mapContributorAttributes(
        userDetails: UserDetailsGitHub
    ): IContributorAttributes {
        return {
            githubId: userDetails.id.toString(),
            githubLogin: userDetails.login,
            githubEmail: userDetails.email,
            githubName: userDetails.name,
            githubAvatarUrl: userDetails.avatar_url,
        };
    }
}

export { ContributorFetcher };
