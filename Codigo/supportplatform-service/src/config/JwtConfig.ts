import jwt from "jsonwebtoken";
import EnvConfig from "./EnvConfig";

const JWT_PRIVATE_KEY = EnvConfig.JWT_PRIVATE_KEY || "your_jwt_private_key";
const JWT_PUBLIC_KEY = EnvConfig.JWT_PUBLIC_KEY || "your_jwt_public_key";

// Generate token for user id with 1 day expiration using JWT_PRIVATE_KEY
export function generateToken(id: number) {
    const token = jwt.sign({ id }, JWT_PRIVATE_KEY, {
        expiresIn: "1d",
        algorithm: "RS256",
    });
    const expiresAt = jwt.decode(token, { json: true })?.exp;
    return { token, expiresAt };
}

// Verify token using JWT_PUBLIC_KEY
export function verifyToken(token: string) {
    return jwt.verify(token, JWT_PUBLIC_KEY, {
        algorithms: ["RS256"],
    });
}
