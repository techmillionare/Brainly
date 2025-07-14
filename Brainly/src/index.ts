import  express from "express";
import {z} from "Zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
// import { JWT_SECRET } from "./config";
import { userMiddleware } from "./auth";
import { Request, Response } from "express";
import { random } from "./utils";
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();

interface AuthenticatedRequest extends Request {
    userId?: string;
}

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {  
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

const app = express();
// app.use(cors({
//   origin: ['http://localhost:5173',"https://second-brain-gilt-iota.vercel.app/"], // replace with your frontend URL
// //   credentials: true // if you use cookies or sessions
// }));
app.use(cors());

app.use(express.json());

app.post('/api/v1/signup',async (req,res) => {
    try{
        const bodyRequired = z.object({
            username: z.string().min(3).max(15),
            password: z
                .string()
                .min(8, 'The password must be at least 8 characters long')
                .max(32, 'The password must be a maximun 32 characters')
                .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                .regex(/[0-9]/, "Password must contain at least one number")
                .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)")
        });

        const parseDataWithSuccess = bodyRequired.safeParse(req.body);

        if(!parseDataWithSuccess.success) {
            res.status(411).json({message: "Error in inputs"});
            return
        }

        const username = req.body.username;
        const password = req.body.password;

        const userFound = await UserModel.findOne({
            username: username
        });

        if(userFound){
            res.status(403).json({message: "User already exists with this username"});
            return;
        }

        const hashedPassword = await bcrypt.hash(password,5);

        await UserModel.create({
            username: username,
            password: hashedPassword
        });

        res.status(200).json( {message: "signed up successfully"} );
    }catch(err: any){
        res.status(500).json({
            message: "Server Error",
            error: err.name,
            details: err.message
        })
    }
});

app.post('/api/v1/signin',async (req,res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;

        const user = await UserModel.findOne({
            username: username
        });

        if (!user) {
            res.status(403).json({ message: "Incorrect username or password" });
            return;
        }

        const passwordMatched =  await bcrypt.compare(password,user.password);
        if(passwordMatched){
            const token = jwt.sign({
                id : user._id
            },JWT_SECRET);
            res.status(200).json({
                token : token,
                message: "signed in successfully"
            })
        }else{
            res.status(403).json({
                message : "Incorrect username or password"
            })
        }
    }catch(err: any){
        res.status(500).json({
            message: "Server Error",
            error: err.name,
            details: err.message
        })
    }
})

app.post('/api/v1/content',userMiddleware,async (req: AuthenticatedRequest,res: Response) => {
    const title = req.body.title;
    const type = req.body.type;
    const link = req.body.link;
    const createdAt = new Date();

    if (!req.userId) {
        res.status(401).json({ message: "Unauthorized: User ID not found" });
        return
    }
    try{
        await ContentModel.create({
            title,
            link,
            type,
            tag: [],
            userId: req.userId,
            createdAt
        })

        res.status(200).json({
            message: "Content Added"
        })
    }catch(err: any){
        console.error("Content creation error:", err);
        res.status(500).json({
            message: "Server Error",
            error: err.name
        })
    }
})

app.get('/api/v1/content',userMiddleware,async (req: AuthenticatedRequest,res) => {
    const userId = req.userId;

    const content = await ContentModel.find({userId}).populate("userId","username");

    res.status(200).json({content});
})

app.delete('/api/v1/delete',userMiddleware,async (req: AuthenticatedRequest,res) => {
    const contentId = req.body.contentId;

    if(!contentId){
        res.status(400).json({message: "Content ID is required"});
        return;
    }

    if(!req.userId){
        res.status(401).json({message: "Unauthorized: User ID not found"});
        return;
    }
    try{
        const result = await ContentModel.deleteOne({
            _id: contentId,
            userId: req.userId
        })

        if(result.deletedCount === 0){
            res.status(404).json({message: "Content not found"});
            return;
        }

        res.json({
            message: "Content deleted successfully"
        })
    }catch(err: any){
        res.status(403).json({message: "Server Error"})
    }
})

app.post('/api/v1/brain/share',userMiddleware, async (req: AuthenticatedRequest,res) => {
    const { share } = req.body;

    if(share){
        const existingLink = await LinkModel.findOne({
            userId: req.userId
        })
        if(existingLink){
            res.json({
                hash: existingLink.hash
            })
            return;
        }
        const hash = random(10);
        await LinkModel.create({
            userId: req.userId,
            hash: hash
        })
        res.json({
            hash: hash
        })
        return;
    }else{
        await LinkModel.deleteOne({
            userId: req.userId
        })

        res.json({
            message: "Link Removed"
        })
    }

    // res.status(200).json({
    //     message: "updated sharable link"
    // })
})

app.get('/api/v1/brain/:shareLink',async (req,res) => {
    const  hash  = req.params.shareLink;

    try{
        const link = await LinkModel.findOne({hash});

        if(!link){
            res.status(411).json({
                message: "sorry incorrect input"
            })
            return;
        }
        // const userId = link.userId;
        const content = await ContentModel.find({userId: link.userId});

        const user = await UserModel.findOne({_id: link.userId})

        res.json({
            username: user?.username,
            content
        })
    }catch(err: any){
        res.status(411).json({
            error: err.name
        })
    }
})

app.listen(3000);