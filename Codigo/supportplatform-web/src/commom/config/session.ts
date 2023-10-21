import { getCookies } from "../utils/cookies";

export type SessionCookieName = "token" | "github-auth-session-cookie";

export function isUserAuthenticated() {
    return Boolean(getCookies<SessionCookieName>().token);
}
