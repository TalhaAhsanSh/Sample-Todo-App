import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export interface ILoginRequestDto {
  email: string;
  password: string;
}
