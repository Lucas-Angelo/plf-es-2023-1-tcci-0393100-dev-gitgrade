// Lê todos os cookies da página e os divide em um objeto
export function getCookies<TCookieAttribute extends string = string>() {
    const cookies = document.cookie.split(";").reduce((cookieObj, cookie) => {
        const [name, value] = cookie.trim().split("=");
        cookieObj[name as TCookieAttribute] = value;
        return cookieObj;
    }, {} as Record<TCookieAttribute, string | undefined>);
    return cookies;
}

export function cleanCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
