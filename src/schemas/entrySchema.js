import joi from 'joi';
const entrySchema = joi.object({
    value:joi.number().required(),
    description:joi.string().required().min(3).max(20)
})

export default entrySchema;
