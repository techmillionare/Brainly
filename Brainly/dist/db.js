"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.Tag = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URL;
if (!uri) {
    throw new Error("MONGODB_URL is not defined in the environment variables");
}
mongoose_1.default.connect(uri, {}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const TagSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true }
});
// const contentTypes = ['images', 'videos', 'audio', 'links', 'article'];
const contentTypes = ['Youtube', 'Twitter', 'Notion', 'Instagram', 'Facebook'];
const ContentSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    tag: [{ type: mongoose_1.default.Types.ObjectId, ref: "tags" }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "users", required: true },
    createdAt: { type: Date, default: Date.now }
});
const LinkSchema = new mongoose_1.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "users", required: true, unique: true }
});
exports.UserModel = (0, mongoose_1.model)('users', UserSchema);
exports.Tag = (0, mongoose_1.model)('tags', TagSchema);
exports.ContentModel = (0, mongoose_1.model)('contents', ContentSchema);
exports.LinkModel = (0, mongoose_1.model)('links', LinkSchema);
