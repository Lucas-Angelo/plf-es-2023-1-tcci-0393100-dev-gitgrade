// Lê todos os cookies da página e os divide em um objeto
export function getCookies<TCookieAttribute extends string = string>() {
    const cookies = document.cookie.split(";").reduce((cookieObj, cookie) => {
        const [name, value] = cookie.trim().split("=");
        cookieObj[name as TCookieAttribute] = value;
        return cookieObj;
    }, {} as Record<TCookieAttribute, string | undefined>);
    return cookies;
}
