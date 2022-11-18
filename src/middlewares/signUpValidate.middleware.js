import signUpSchema from '../schemas/signUpSchema.js'
export default function signUpValidate(req, res, next) {
    const { error } = signUpSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(422).send(errors);//422 Unprocessable Entity
    }
    next();
}