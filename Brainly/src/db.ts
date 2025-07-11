import mongoose, { model, Schema } from "mongoose"
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URL;

if(!uri) {
    throw new Error("MONGODB_URL is not defined in the environment variables");
}

mongoose.connect(uri , {
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

const UserSchema = new Schema({
    username: {type: String, unique: true,required: true},
    password: { type: String, required: true}
});

const TagSchema = new Schema({
    title: {type: String, required: true, unique: true}
});

// const contentTypes = ['images', 'videos', 'audio', 'links', 'article'];
const contentTypes = ['Youtube', 'Twitter', 'Notion', 'Instagram','Facebook'];

const ContentSchema = new Schema({
    title: {type: String, required: true},
    link: {type: String, required: true},
    type: {type: String, enum: contentTypes, required: true},
    tag: [{type: mongoose.Types.ObjectId, ref: "tags"}],
    userId: {type: mongoose.Types.ObjectId, ref: "users", required: true},
    createdAt: { type: Date, default: Date.now }
});

const LinkSchema = new Schema({
    hash: {type: String, required: true},
    userId: {type: mongoose.Types.ObjectId, ref: "users", required: true, unique: true}
});

export const UserModel = model('users',UserSchema);
export const Tag = model('tags',TagSchema);
export const ContentModel = model('contents',ContentSchema);
export const LinkModel = model('links',LinkSchema);

