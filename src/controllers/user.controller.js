import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { usersCollection } from '../index.js';
import { sessionsCollection } from '../index.js';
import { signUpSchema } from '../index.js';
import { signInSchema } from '../index.js';

export async function postSignIn(req, res) {
    try {
        const { email, password } = req.body;

        const { error } = signInSchema.validate({ email, password }, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(422).send(errors);//bad request
        }

        const userExists = await usersCollection.findOne({ email })
        if (!userExists) {
            return res.sendStatus(404);//not found
        }

        if (userExists && bcrypt.compareSync(password, userExists.password)) {
            const token = uuid();
            const isUserSessionExists = await sessionsCollection.findOne({userId:userExists._id})
            if(isUserSessionExists){
                return res.send("user already loggedin")
            }
            await sessionsCollection.insertOne({
                userId: userExists._id,
                token
            })
            res.send(token)
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function postSignUp(req, res) {
    try {
        const { name, email, password } = req.body;
        const user = {
            name,
            email,
            password
        };
        const { error } = signUpSchema.validate(user, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(422).send(errors);//bad request
        }
        const userExists = await usersCollection.findOne({ email });
        if (userExists) {
            return res.sendStatus(409); // conflict - already registered
        }
        const passwordCrypted = bcrypt.hashSync(user.password, 10);
        user.password = passwordCrypted;
        await usersCollection.insertOne(user);
        res.sendStatus(201); // created
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}