import { redirect } from "react-router";
import { SessionCookieName } from "../../commom/config/session";
import { getCookies } from "../../commom/utils/cookies";

export default function loginPageLoader() {
    const cookies = getCookies<SessionCookieName>();
    const token = cookies.token;

    if (!token) {
        return null;
    } else {
        return redirect("/");
    }
}
