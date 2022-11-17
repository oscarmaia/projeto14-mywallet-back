import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import joi from 'joi';
import signInRouter from './routes/signInRouter.js'
import signUpRouter from './routes/signUpRouter.js'


dotenv.config();
const app = express();

//configs
app.use(cors());
app.use(express.json());
app.use(signInRouter);
app.use(signUpRouter);


//schemas
export const signUpSchema = joi.object({
    name:joi.string().min(3).max(51).required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required()
})

export const signInSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(6).required()
})



const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Connected to port: ${port}`);
});
