import express from 'express';
import authRouter from './auth.route';    
import userRouter from './user.route';    
import taskRouter from './task.route';    

const mainRouter = express.Router();
mainRouter.use('/auth', authRouter);
mainRouter.use('/users', userRouter);
mainRouter.use('/tasks/', taskRouter);

export default mainRouter; 