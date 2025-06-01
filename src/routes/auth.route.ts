import express from 'express';
import { signupSchema } from '../dto/requests/signup.request.dto';
import { BadRequestError } from '../error/custom_error.error';
import Joi from 'joi';
import { AuthController } from '../controllers/auth.controller';
import { loginSchema } from '../dto/requests/login.request.dto';

const router = express.Router();
const authController = new AuthController();

function validateBody(schema: Joi.ObjectSchema) {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }
    next();
  };
}

router.post('/signup', validateBody(signupSchema), authController.signup.bind(authController));
router.post('/login', validateBody(loginSchema), authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));


export default router;
