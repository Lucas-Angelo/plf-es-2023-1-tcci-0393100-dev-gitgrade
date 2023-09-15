import jwt from "jsonwebtoken";
import EnvConfig from "./EnvConfig";

const JWT_SECRET = EnvConfig.JWT_SECRET || "your_jwt_secret";

// Generate token for user id with 1 day expiration using JWT_SECRET
export function generateToken(id: number) {
    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
    const expiresAt = jwt.decode(token, { json: true })?.exp;
    return { token, expiresAt };
}

// Verify token using JWT_SECRET
export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}
