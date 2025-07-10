"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: "Authorization token is missing" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
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
