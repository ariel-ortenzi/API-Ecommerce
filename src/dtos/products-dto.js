import Joi from "joi";

export const productsDto = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().min(0).required(),
    thumbnail: Joi.string(),
    code: Joi.string(),
    stock: Joi.number().min(0).required(),
    status: Joi.boolean().default(true),
    category: Joi.string(),
});