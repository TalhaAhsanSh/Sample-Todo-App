import express from 'express';
import { UserController } from '../controllers/user.controller';
import { getUserQuerySchema } from '../dto/requests/user.get.request.dto';
import { BadRequestError } from '../error/custom_error.error';
import Joi from 'joi';

const router = express.Router();
const userController = new UserController();

function validateQuery(schema: Joi.ObjectSchema) {
    return (req: any, res: any, next: any) => {
      const { error } = schema.validate(req.query);
      if (error) {
        return next(new BadRequestError(error.details[0].message));
      }
      next();
    };
  }

router.get('/user',validateQuery(getUserQuerySchema), userController.getUserProfile.bind(userController));
router.get('/me', userController.getProfile.bind(userController));

export default router;
