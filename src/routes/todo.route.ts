import express from 'express';
import { TodoController } from '../controllers/todo.controller';
import { addTaskBodySchema } from '../dto/requests/addTask.request.dto';
import { BadRequestError } from '../error/custom_error.error';
import Joi from 'joi';

const router = express.Router();
const todoController = new TodoController();

function validateBody(schema: Joi.ObjectSchema) {
    return (req: any, res: any, next: any) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return next(new BadRequestError(error.details[0].message));
      }
      next();
    };
}

router.post(
  '/task',
  validateBody(addTaskBodySchema),
  todoController.addTask.bind(todoController)
);

export default router;
