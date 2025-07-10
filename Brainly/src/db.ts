import mongoose, { model, Schema } from "mongoose"

mongoose.connect("mongodb+srv://mishradayanand587:GwDg0cXlSnYqcSPF@cluster0.3pmus.mongodb.net/brainly");

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

