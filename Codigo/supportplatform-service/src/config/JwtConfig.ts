import jwt from "jsonwebtoken";
import EnvConfig from "./EnvConfig";

const JWT_SECRET = EnvConfig.JWT_SECRET || "your_jwt_secret";

export function generateToken(id: number) {
    return jwt.sign({ id }, JWT_SECRET);
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}
