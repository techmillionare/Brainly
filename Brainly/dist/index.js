"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Zod_1 = require("Zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
// import { JWT_SECRET } from "./config";
const auth_1 = require("./auth");
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
const app = (0, express_1.default)();
// app.use(cors({
//   origin: ['http://localhost:5173',"https://second-brain-gilt-iota.vercel.app/"], // replace with your frontend URL
// //   credentials: true // if you use cookies or sessions
// }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bodyRequired = Zod_1.z.object({
            username: Zod_1.z.string().min(3).max(15),
            password: Zod_1.z
                .string()
                .min(8, 'The password must be at least 8 characters long')
                .max(32, 'The password must be a maximun 32 characters')
                .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                .regex(/[0-9]/, "Password must contain at least one number")
                .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)")
        });
        const parseDataWithSuccess = bodyRequired.safeParse(req.body);
        if (!parseDataWithSuccess.success) {
            res.status(411).json({ message: "Error in inputs" });
            return;
        }
        const username = req.body.username;
        const password = req.body.password;
        const userFound = yield db_1.UserModel.findOne({
            username: username
        });
        if (userFound) {
            res.status(403).json({ message: "User already exists with this username" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 5);
        yield db_1.UserModel.create({
            username: username,
            password: hashedPassword
        });
        res.status(200).json({ message: "signed up successfully" });
    }
    catch (err) {
        res.status(500).json({
            message: "Server Error",
            error: err.name,
            details: err.message
        });
    }
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = yield db_1.UserModel.findOne({
            username: username
        });
        if (!user) {
            res.status(403).json({ message: "Incorrect username or password" });
            return;
        }
        const passwordMatched = yield bcrypt_1.default.compare(password, user.password);
        if (passwordMatched) {
            const token = jsonwebtoken_1.default.sign({
                id: user._id
            }, JWT_SECRET);
            res.status(200).json({
                token: token,
                message: "signed in successfully"
            });
        }
        else {
            res.status(403).json({
                message: "Incorrect username or password"
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: "Server Error",
            error: err.name,
            details: err.message
        });
    }
}));
app.post('/api/v1/content', auth_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const type = req.body.type;
    const link = req.body.link;
    const createdAt = new Date();
    if (!req.userId) {
        res.status(401).json({ message: "Unauthorized: User ID not found" });
        return;
    }
    try {
        yield db_1.ContentModel.create({
            title,
            link,
            type,
            tag: [],
            userId: req.userId,
            createdAt
        });
        res.status(200).json({
            message: "Content Added"
        });
    }
    catch (err) {
        console.error("Content creation error:", err);
        res.status(500).json({
            message: "Server Error",
            error: err.name
        });
    }
}));
app.get('/api/v1/content', auth_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({ userId }).populate("userId", "username");
    res.status(200).json({ content });
}));
app.delete('/api/v1/delete', auth_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    if (!contentId) {
        res.status(400).json({ message: "Content ID is required" });
        return;
    }
    if (!req.userId) {
        res.status(401).json({ message: "Unauthorized: User ID not found" });
        return;
    }
    try {
        const result = yield db_1.ContentModel.deleteOne({
            _id: contentId,
            userId: req.userId
        });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Content not found" });
            return;
        }
        res.json({
            message: "Content deleted successfully"
        });
    }
    catch (err) {
        res.status(403).json({ message: "Server Error" });
    }
}));
app.post('/api/v1/brain/share', auth_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    if (share) {
        const existingLink = yield db_1.LinkModel.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield db_1.LinkModel.create({
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash: hash
        });
        return;
    }
    else {
        yield db_1.LinkModel.deleteOne({
            userId: req.userId
        });
        res.json({
            message: "Link Removed"
        });
    }
    // res.status(200).json({
    //     message: "updated sharable link"
    // })
}));
app.get('/api/v1/brain/:shareLink', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    try {
        const link = yield db_1.LinkModel.findOne({ hash });
        if (!link) {
            res.status(411).json({
                message: "sorry incorrect input"
            });
            return;
        }
        // const userId = link.userId;
        const content = yield db_1.ContentModel.find({ userId: link.userId });
        const user = yield db_1.UserModel.findOne({ _id: link.userId });
        res.json({
            username: user === null || user === void 0 ? void 0 : user.username,
            content
        });
    }
    catch (err) {
        res.status(411).json({
            error: err.name
        });
    }
}));
app.listen(3000);
