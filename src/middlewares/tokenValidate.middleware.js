import { sessionsCollection, usersCollection } from "../database/database.js";

export async function tokenValidate(req, res, next) {
    console.log("ENTROU NO TOKEN VALIDATE")
    try {
        const bearer = req.headers.token;
        const token = bearer?.replace("Bearer ", "")
        console.log(token)
        if (!token) {
            return res.status(401).send("invalid token");
        }
        const userSession = await sessionsCollection.findOne({ token });
        if (!userSession) {
            return res.status(404).send("user is not connected");
        } else {
            const user = await usersCollection.findOne({ _id: userSession.userId })
            delete user.password;
            res.locals.user = user;
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
    next();
}