import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dirname from "es-dirname";
import path from "path";
import qs from "qs";
import sonarqubeScanner from "sonarqube-scanner";
import EnvConfig from "../config/EnvConfig";
import logger from "../config/LogConfig";
import AppError from "../error/AppError";
import { GitHubRepositoryService } from "../service/client/GitHubRepositoryService";

const projectRootPath = path.join(dirname(), "../../");

class SonarQubeAnalyzer {
    private repositoryName: string;
    private repositoryPath: string;
    private sonarUrl: string;
    private sonarAdminUsername: string;
    private sonarAdminPassword: string;
    private projectKey: string;
    private projectName: string;

    private static readonly repositoriesTempDirectory = "./temp/repositories";

    private gitHubRepositoryService: GitHubRepositoryService;

    constructor(repositoryName: string) {
        this.gitHubRepositoryService = new GitHubRepositoryService();

        this.repositoryName = repositoryName;
        this.repositoryPath = path.join(
            projectRootPath,
            SonarQubeAnalyzer.repositoriesTempDirectory,
            this.repositoryName
        );
        this.sonarUrl = `http://${EnvConfig.SONARQUBE_HOST}:${EnvConfig.SONARQUBE_PORT}`;
        this.sonarAdminUsername = EnvConfig.SONARQUBE_ADMIN_USERNAME!;
        this.sonarAdminPassword = EnvConfig.SONARQUBE_ADMIN_PASSWORD!;

        const projectId =
            this.repositoryName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() +
            Date.now();
        this.projectKey = projectId;
        this.projectName = projectId;

        logger.info("SonarQubeAnalyzer created", {
            repositoryName,
            repositoryPath: this.repositoryPath,
            sonarUrl: this.sonarUrl,
            sonarAdminUsername: this.sonarAdminUsername,
            sonarAdminPassword: this.sonarAdminPassword,
            projectKey: this.projectKey,
            projectName: this.projectName,
        });
    }

    public async run() {
        await this.cloneRepo();
        logger.info("Repository cloned");
        await this.createSonarProject();
        logger.info("Sonar project created");
        const token = await this.generateToken();
        logger.info("Token generated");
        await this.analyzeWithSonarQube(token);
        logger.info("SonarQube analysis finished");
    }

    private async cloneRepo(): Promise<void> {
        await this.gitHubRepositoryService.cloneRepository(this.repositoryName);
    }

    private async createSonarProject() {
        try {
            const formData = qs.stringify({
                name: this.projectName,
                project: this.projectKey,
            });

            const response = await axios.post(
                `${this.sonarUrl}/api/projects/create`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    auth: {
                        username: this.sonarAdminUsername,
                        password: this.sonarAdminPassword,
                    },
                }
            );
            if (response.status >= 400) {
                {
                    // eslint-disable-next-line no-console
                    console.error(response);
                    throw new AppError(
                        "Error while creating Sonar project, bad status",
                        500,
                        {
                            response,
                        }
                    );
                }
            }
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line no-console
            console.error("Error Data:", error.response && error.response.data);
            // eslint-disable-next-line no-console
            console.error(error);
            throw new AppError("Error while creating Sonar project", 500, {
                error,
            });
        }
    }

    private async generateToken() {
        try {
            const formData = qs.stringify({
                name: this.projectKey,
            });

            const response = await axios.post(
                `${this.sonarUrl}/api/user_tokens/generate`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    auth: {
                        username: this.sonarAdminUsername,
                        password: this.sonarAdminPassword,
                    },
                }
            );
            if (response.status >= 400) {
                {
                    throw new AppError(
                        "Error while generating Sonar token, bad status",
                        500,
                        {
                            response,
                        }
                    );
                }
            }
            return response.data.token;
        } catch (error) {
            throw new AppError("Error while generating Sonar token", 500, {
                error,
            });
        }
    }

    private async analyzeWithSonarQube(token: string): Promise<void> {
        try {
            // Go to repository path to run sonarqube scanner (for sonar.sources property capture files)
            process.chdir(this.repositoryPath);

            await new Promise<void>((resolve, reject) => {
                sonarqubeScanner(
                    {
                        serverUrl: this.sonarUrl,
                        token: token,
                        options: {
                            "sonar.projectKey": this.projectKey,
                            "sonar.sources": ".",
                            "sonar.projectName": this.projectName,
                            "sonar.login": token,
                            "sonar.exclusions": "**/node_modules/**",
                        },
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (result?: any) => {
                        if (result) {
                            reject(
                                new AppError(
                                    "Error while analyzing with SonarQube",
                                    500,
                                    { error: result }
                                )
                            );
                        } else {
                            resolve();
                        }
                    }
                );
            });
        } catch (error) {
            throw new AppError("Error while analyzing with SonarQube", 500, {
                error,
            });
        }
    }

    buildPath(): string {
        return `/dashboard?id=${this.projectKey}`;
    }
}

export default SonarQubeAnalyzer;
