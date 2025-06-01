import Joi from 'joi';

export const addTaskBodySchema = Joi.object({
  task: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Task description cannot be empty',
    'any.required': 'Task is required',
    'string.max': 'Task cannot be longer than 255 characters',
  }),
});
