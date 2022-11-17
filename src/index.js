import express from 'express'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import cors from 'cors'
import joi from 'joi';
//import { postSignIn } from './controllers/user.controller.js'
import { postSignUp } from './controllers/user.controller.js'
const app = express();

//configs
app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

//schemas
export const userSchema = joi.object({
    name:joi.string().min(3).max(51).required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required()
})

//connect to database
try {
    await mongoClient.connect();
    console.log("Connected to database successfully");
    db = mongoClient.db("myWallet");
} catch (error) {
    console.log(error);
}

export const userCollection = db.collection("users");

//app.post('/sign-in',postSignIn);
app.post('/sign-up',postSignUp);


const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Connected to port: ${port}`);
});
