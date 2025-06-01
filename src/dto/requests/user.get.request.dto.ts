import Joi from 'joi';

export const getUserQuerySchema = Joi.object({
  userId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.length': 'userId must be a valid 24-character hex string',
      'any.required': 'userId query parameter is required',
    }),
});
