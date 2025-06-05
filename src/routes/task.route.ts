import express from 'express';
import { TaskController } from '../controllers/tasks.controller';
import { authenticate } from '../middlewares/authenticate.middleware'; // Your authentication middleware
import { isVerified } from '../middlewares/isVerified.middleware';
const router = express.Router();
const taskController = new TaskController();


router.post(
  '/',
  authenticate, //  User must be logged in
  isVerified,   //  User's email must be verified
  taskController.createTask.bind(taskController)
);

router.get(
  '/',
  //authenticate,
  isVerified,
  taskController.getAllUserTasks.bind(taskController)
);

router.get(
  '/:taskId',
  //authenticate,
  isVerified,
  taskController.getTaskById.bind(taskController)
);

router.put(
  '/:taskId',
  //authenticate,
  isVerified,
  taskController.updateTask.bind(taskController)
);

router.delete(
  '/:taskId',
  //authenticate,
  isVerified,
  taskController.deleteTask.bind(taskController)
);

export default router;