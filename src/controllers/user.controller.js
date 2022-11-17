import bcrypt from 'bcrypt'
import { userCollection } from '../index.js';
import { userSchema } from '../index.js';


export async function postSignUp(req, res) {
    try {
        const { name, email, password } = req.body;
        const user = {
            name,
            email,
            password
        };
        const userExists = await userCollection.findOne({email});
        if(userExists){
            return res.sendStatus(409)
        }
        const {error} = userSchema.validate(user,{abortEarly:false});
        if(error){
            const erros = error.details.map(detail => detail.message);
            return res.status(422).send(erros)
        }
        const passwordCrypted = bcrypt.hashSync(user.password,10);
        user.password = passwordCrypted;
        await userCollection.insertOne(user);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}