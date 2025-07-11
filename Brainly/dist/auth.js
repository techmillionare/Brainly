"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { JWT_SECRET } from "./config";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
const userMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: "Authorization token is missing" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log("✅ Decoded token:", decoded);
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        console.log("❌ Token verification failed:", err);
        res
            .status(401)
            .json({ message: "You are not logged in or session expired" });
    }
};
exports.userMiddleware = userMiddleware;
