import jwt from "jsonwebtoken";

export function verifyToken(token: string, publicKey: string) {
    return jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
    });
}
