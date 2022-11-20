import bcrypt from 'bcrypt'
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid'
import { entriesCollection, usersCollection } from '../database/database.js';
import { sessionsCollection } from '../database/database.js';

export async function postSignIn(req, res) {
    try {
        const { email, password } = req.body;

        const userExists = await usersCollection.findOne({ email })
        if (!userExists) {
            return res.status(404).send("user not found");//not found
        }

        if (userExists && bcrypt.compareSync(password, userExists.password)) {
            const token = uuid();
            const isUserSessionExists = await sessionsCollection.findOne({ userId: userExists._id })
            if (isUserSessionExists) {
                await sessionsCollection.deleteOne({ _id: isUserSessionExists._id })
            }
            await sessionsCollection.insertOne({
                userId: userExists._id,
                token
            })
            res.send({ token })
        } else {
            return res.status(401).send("wrong password");//not found
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function postSignUp(req, res) {
    try {
        const { email, password } = req.body;

        const userExists = await usersCollection.findOne({ email });
        if (userExists) {
            return res.sendStatus(409); // conflict - already registered
        }
        const passwordCrypted = bcrypt.hashSync(password, 10);
        req.body.password = passwordCrypted;
        await usersCollection.insertOne(req.body);
        res.sendStatus(201); // created
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function postIncoming(req, res) {
    try {
        const user = res.locals.user;
        const { value, description } = req.body;
        const timeNow = Date.now();
        const entry = {
            userId: user._id,
            value,
            description,
            type: "incoming",
            date: dayjs(timeNow).format("DD/MM")
        }
        await entriesCollection.insertOne(entry);
        res.sendStatus(201);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export async function postExpense(req, res) {
    try {
        const user = res.locals.user;
        const { value, description } = req.body;
        const timeNow = Date.now();
        const entry = {
            userId: user._id,
            value,
            description,
            type: "expense",
            date: dayjs(timeNow).format("DD/MM")
        }
        await entriesCollection.insertOne(entry);
        res.sendStatus(201);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export async function getEntries(req, res) {
    try {
        console.log("getEntries func")
        const user = res.locals.user;
        const entriesByUser = await entriesCollection.find({ userId: user._id }).toArray();
        const requestedUser = {
            name:user.name,
            email:user.email,
            _entries:entriesByUser
        }
        res.status(200).send(requestedUser);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}
