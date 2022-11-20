import entrySchema from '../schemas/entrySchema.js'
export default function entryValidate(req, res, next) {
    const { error } = entrySchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(422).send(errors);//422 Unprocessable Entity
    }
    next();
}