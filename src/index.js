import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import signInRouter from './routes/signInRouter.js'
import signUpRouter from './routes/signUpRouter.js'


dotenv.config();
const app = express();

//configs
app.use(cors());
app.use(express.json());
app.use(signInRouter);
app.use(signUpRouter);


const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Connected to port: ${port}`);
});
