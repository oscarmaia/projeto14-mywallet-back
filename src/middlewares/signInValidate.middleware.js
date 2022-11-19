import signInSchema from '../schemas/signInSchema.js'
export default function signInValidate(req, res, next) {
    const { email, password } = req.body;
    const { error } = signInSchema.validate({ email, password }, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        console.log(errors)
        return res.status(422).send(errors);//422 Unprocessable Entity
    }
    next();
}
