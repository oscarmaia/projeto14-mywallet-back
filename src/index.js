import express from 'express'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import cors from 'cors'
const app = express();

//configs
app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
    await mongoClient.connect();
    console.log("Connected to database successfully")
} catch (error) {
    console.log(error)
}


const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Connected to port: ${port}`);
})
