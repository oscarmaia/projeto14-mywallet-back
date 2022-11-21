import bcrypt from 'bcrypt'
import { ObjectID } from 'bson';
import { v4 as uuid } from 'uuid'
import { entriesCollection, usersCollection } from '../database/database.js';
import { sessionsCollection } from '../database/database.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
dayjs.extend(utc);
dayjs.extend(timezone);

export async function postSignIn(req, res) {
    try {
        const { email, password } = req.body;

        const userExists = await usersCollection.findOne({ email })
        if (!userExists) {
            return res.status(404).send("email not registered");//not found
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
            return res.status(409).send("email already registered"); // conflict - already registered
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
        const timeZoneBr = "America/Sao_Paulo";
        const timeNow = dayjs().format(`YYYY-MM-DD HH:mm:ss`);
        const timeInBrazil = dayjs.tz(timeNow).tz(timeZoneBr).format("DD/MM")
        const user = res.locals.user;
        const { value, description } = req.body;
        const entry = {
            userId: user._id,
            value,
            description,
            type: "incoming",
            date: timeInBrazil
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
        const timeZoneBr = "America/Sao_Paulo";
        const timeNow = dayjs().format(`YYYY-MM-DD HH:mm:ss`);
        const timeInBrazil = dayjs.tz(timeNow).tz(timeZone).format("DD/MM")
        const user = res.locals.user;
        const { value, description } = req.body;
        const entry = {
            userId: user._id,
            value,
            description,
            type: "expense",
            date: timeInBrazil
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
        const user = res.locals.user;
        const entriesByUser = await entriesCollection.find({ userId: user._id }).toArray();
        const requestedUser = {
            userId: user._id,
            name: user.name,
            email: user.email,
            _entries: entriesByUser
        }
        res.status(200).send(requestedUser);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export async function postLogout(req, res) {
    try {
        const { _id } = req.body
        const session = await sessionsCollection.findOne({ userId: ObjectID(_id) });
        if (!session) {
            res.sendStatus(404);
        }
        await sessionsCollection.deleteOne({ userId: session.userId })
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export async function deleteEntry(req, res) {
    const id = req.params;
    try {
        res.send(id)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}