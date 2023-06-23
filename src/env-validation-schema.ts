import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    APP_PORT: Joi.number().required(),
    ENV_NAME: Joi.string().required(),
    LOG_PRETTY: Joi.boolean(),
    LOG_LEVEL: Joi.string().required(),
    MONGODB_URI: Joi.string().required(),
});
