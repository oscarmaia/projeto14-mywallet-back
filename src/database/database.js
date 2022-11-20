import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

//connect to database
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
try {
    await mongoClient.connect();
    console.log("Connected to database successfully");
    db = mongoClient.db("myWallet");
} catch (error) {
    console.log(error);
}

export const usersCollection = db.collection("users");
export const sessionsCollection = db.collection("sessions");
export const entriesCollection = db.collection("entries");