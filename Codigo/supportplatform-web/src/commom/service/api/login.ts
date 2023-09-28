import env from "../../config/env";

export class LoginService {
    redirectToGithubAuth() {
        window.location.href = env.apiUrl + "/oauth/github";
    }
}
