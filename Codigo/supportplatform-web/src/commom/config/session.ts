import { getCookies } from "../utils/cookies";

export type SessionCookieName = "token" | "githubToken";

export function isUserAuthenticated() {
    return Boolean(getCookies<SessionCookieName>().token);
}
