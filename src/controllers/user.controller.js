import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { usersCollection } from '../database/database.js';
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

export async function getUserLoggedIn(req, res) {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).send("invalid token");
        }
        const userSession = await sessionsCollection.findOne({ token });
        if (!userSession) {
            return res.status(404).send("user is not connected");
        } else {
            const user = await usersCollection.findOne({ _id: userSession.userId })
            delete user.password;
            res.send(user)
        }


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}
