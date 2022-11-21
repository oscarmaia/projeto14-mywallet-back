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
        let { email, password } = req.body;
        email = email.toLowerCase();
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
        let { email, password, name } = req.body;
        email = email.toLowerCase();
        const userExists = await usersCollection.findOne({ email });
        if (userExists) {
            return res.status(409).send("email already registered"); // conflict - already registered
        }
        const passwordCrypted = bcrypt.hashSync(password, 10);
        password = passwordCrypted;
        await usersCollection.insertOne({ email, password, name });
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
        const timeInBrazil = dayjs.tz(timeNow).tz(timeZoneBr).format("DD/MM")
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
function getBalance(entries) {
    let amount = 0;
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].type === 'incoming') {
            entries[i].value = +entries[i].value;
            amount += entries[i].value;
        }
        else {
            entries[i].value = +entries[i].value;
            amount -= entries[i].value;
        }
    }
    return amount;
}
export async function getEntries(req, res) {
    try {
        const user = res.locals.user;
        const entriesByUser = await entriesCollection.find({ userId: user._id }).toArray();
        const requestedUser = {
            userId: user._id,
            name: user.name,
            email: user.email,
            entries: entriesByUser
        }
        const { entries } = requestedUser;
        const balance = getBalance(entries);
        res.status(200).send({ ...requestedUser, balance });
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
            return res.sendStatus(404);
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
        await entriesCollection.deleteOne({ _id: ObjectID(id) });
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}


export async function updateEntry(req, res) {
    const id = req.params;
    try {
        const entryToBeUpdated = await entriesCollection.findOne({ _id: ObjectID(id) });
        if (!entryToBeUpdated) {
            return res.sendStatus(404);
        }
        await entriesCollection.updateOne({ _id: entryToBeUpdated._id }, { $set: req.body })
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}