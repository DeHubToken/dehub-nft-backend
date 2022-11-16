import * as Joi from 'joi';

export const configuration = () => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    prefix: process.env.PREFIX,
  };
};

export const validationSchema = {
  NODE_ENV: Joi.string().valid('development', 'production'),
  port: Joi.number().default(3000),
  prefix: Joi.string().default('/'),
};
