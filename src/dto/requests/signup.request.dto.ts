// src/dtos/user.dto.ts
import Joi from 'joi';

export interface SignupDTO {
  name: string;
  email: string;
  password: string;
}

export const signupSchema = Joi.object<SignupDTO>({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
