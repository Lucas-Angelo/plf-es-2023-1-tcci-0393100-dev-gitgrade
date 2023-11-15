const apiUrl = import.meta.env.VITE_API_URL;
const defaultApiUrl = "http://localhost:3001";

if (!apiUrl) {
    console.warn(
        `-- Missing enviroment variable VITE_API_URL: defaulted to ${defaultApiUrl} --`
    );
}

const githubOrganizationName = import.meta.env.VITE_GITHUB_ORGANIZATION_NAME;
const defaultGithubOrganizationName = "ICEI-PUC-Minas-PPLES-TI";

if (!githubOrganizationName) {
    console.warn(
        `-- Missing enviroment variable VITE_GITHUB_ORGANIZATION_NAME: defaulted to ${defaultGithubOrganizationName} --`
    );
}

const oauthFailureSearchParam = import.meta.env.VITE_OAUTH_FAILURE_SEARCH_PARAM;
const defaultOauthFailureSearchParam = "message";

const env = {
    apiUrl: apiUrl ?? defaultApiUrl,
    oauthFailureSearchParam:
        oauthFailureSearchParam ?? defaultOauthFailureSearchParam,
    githubOrganizationName:
        githubOrganizationName ?? defaultGithubOrganizationName,
};

export default env;
